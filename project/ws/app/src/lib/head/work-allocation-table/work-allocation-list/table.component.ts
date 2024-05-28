import { WorkallocationService } from './../../../routes/home/services/workallocation.service'
import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'

import { ITableData, IColums } from '../interface/interfaces'
import { Router, ActivatedRoute } from '@angular/router'
import { UserPopupComponent } from '../user-popup/user-popup'
import { CreateMDOService } from '../create-mdo.services'
import { ExportAsConfig } from 'ngx-export-as'

@Component({
  selector: 'ws-work-allocation-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class WorkAllocationTableComponent implements OnInit, OnChanges {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() needCreateUser?: boolean = undefined
  @Input() needAddAdmin?: boolean
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() inputDepartmentId?: string | undefined
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Input() currentFilter!: any
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  viewPaginator = false
  showLoading = true
  showNoData = false
  dataSource!: any
  widgetData: any
  length!: number
  departmentRole!: string
  departmentId!: string | undefined
  pageSize = 20
  pageSizeOptions = [20, 30]
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  downloaddata: any = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  // @ViewChild(MatSort, { static: true }) sort?: MatSort
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  selection = new SelectionModel<any>(true, [])
  constructor(
    private router: Router, public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private createMDOService: CreateMDOService,
    private snackBar: MatSnackBar, private wrkAllocServ: WorkallocationService) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {

    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    // this.dataSource.sort = this.sort
    this.viewPaginator = true
    this.activatedRoute.params.subscribe(params => {
      this.departmentRole = params['currentDept']
      this.departmentId = params['roleId']
      if (this.needCreateUser !== false && this.departmentRole && this.departmentId) {
        this.needAddAdmin = true
        this.needCreateUser = true
      }

    })
    if (!this.departmentId && this.inputDepartmentId) {
      this.departmentId = this.inputDepartmentId
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
    if (this.length === 0) {
      this.showNoData = false
      this.showLoading = true
      setTimeout(() => {
        if (this.showLoading) {
          this.showNoData = true
          this.showLoading = false
        }
        // tslint:disable-next-line: align
      }, 1000)
    } else {
      this.showNoData = false
      this.showLoading = false
    }
  }
  applyFilter(filterValue: any) {

    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
  }
  buttonClick(row: any) {

    if (row) {
      this.wrkAllocServ.getPDF(row.id).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL)
      })

    }
  }

  blobToSaveAs(fileName: string, blob: Blob) {

    // try {

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    if (link.download !== undefined) { // feature detection
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    // }
    //  catch (e) {
    //   console.error('BlobToSaveAs error', e)
    // }
  }
  selectWorkOrder(workOrder: any) {
    this.eOnRowClick.emit(workOrder)
  }
  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }
  openPopup() {
    const dialogRef = this.dialog.open(UserPopupComponent, {
      maxHeight: 'auto',
      height: '65%',
      width: '80%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      response.data.forEach((user: { userId: string }) => {
        if (this.departmentId) {
          const role = `MDO_ADMIN`
          this.createMDOService.assignAdminToDepartment(user.userId, this.departmentId, role).subscribe(res => {
            if (res) {
              this.snackBar.open('Admin assigned Successfully')
              this.router.navigate(['/app/home/directory', { department: this.departmentRole }])
            }
          },
            // tslint:disable-next-line: align
            (err: { error: any }) => {
              this.openSnackbar(err.error.message)
            })
        }
      })

    })

  }
  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  filterList(list: any[], key: string) {
    return list.map(lst => lst[key])
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  onRowClick(e: any) {
    this.eOnRowClick.emit(e)
    if ((e.fromdata || '').toUpperCase() === 'DRAFT') {
      this.router.navigate([`/app/workallocation/drafts`, e.id])
    } else if ((e.fromdata || '').toUpperCase() === 'PUBLISHED') {
      this.router.navigate([`/app/workallocation/published`, e.id])
    }

  }
  gotoCreateUser() {
    this.router.navigate([`/app/home/create-user`], { queryParams: { id: this.departmentId, currentDept: this.departmentRole } })
  }
}
