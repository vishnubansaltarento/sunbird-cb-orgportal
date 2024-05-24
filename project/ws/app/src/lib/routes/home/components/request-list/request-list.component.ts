import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { ProfileV2Service } from '../../services/home.servive'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { ConfirmationBoxComponent } from '../../../training-plan/components/confirmation-box/confirmation.box.component'
import { AssignListPopupComponent } from './assign-list-popup/assign-list-popup.component'
@Component({
  selector: 'ws-app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  tabledata: ITableData = {
    columns: [
      { displayName: 'Request Id', key: 'demand_id' },
      { displayName: 'Title', key: 'title' },
      // { displayName: 'Requestor', key: 'batchesCount' },
      { displayName: 'Request Type', key: 'requestType' },
      { displayName: 'Request Status', key: 'status' },
      { displayName: 'Assignee', key: 'assignedProvider' },
      { displayName: 'Requested On', key: 'createdOn' },
      // { displayName: 'Interest', key: 'batchesCount' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: false,
    actions: [],
    actionColumnName: 'Action',
    cbpPlanMenu: true,
  }
  getTableData: any[] = []
  requestListData: any
  isUnassigned = false
  isAssigned = false
  inProgress = false
  invalid = false
  assignProvider: any
  pageConfig: any
  configSvc: any
  dialogRef: any
  queryParams: any
  pageNo = 0
  pageSize = 10
  requestCount: any
  invalidRes: any
  detailsEvent: any

  constructor(private sanitizer: DomSanitizer,
              private homeService: ProfileV2Service,
              private datePipe: DatePipe,
              private activeRoute: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router
  ) { }
  requestList: any[] = [
    `These reports contain Personally Identifiable Information (PII) data.
      Please use them cautiously.`,
      `Your access to the report is available until.
      Please contact your MDO Leader to renew your access.`,
  ]

  ngOnInit() {
    this.configSvc = this.activeRoute.snapshot.data['configService']
    this.getRequestList()
    this.pageConfig = this.activeRoute.snapshot.data['pageData']
    this.hasAccess()
    // this.tableData =

  }

  hasAccess() {
    let flag = false
    if (this.pageConfig && this.pageConfig.data && this.pageConfig.data.actionMenu) {
      this.pageConfig.data.actionMenu.map((_v: any) => {
        flag = false
        _v.enabledFor.forEach((ele: any) => {
          if (this.configSvc.userRoles.has(ele)) {
            flag = true
            if (ele === 'mdo_leader') {
              _v.isMdoLeader = true
            }
            if (ele === 'mdo_admin') {
              _v.isMdoAdmin = true
            }
          }
        })
        _v.userAccess = flag
      })
    }
  }

  menuSelected(_event: any) {
  switch (_event.action) {
    case 'viewContent':

      this.queryParams = {
      id: _event.row.demand_id,
      name: 'view',
    }
      this.router.navigate(['/app/home/create-request-form'], { queryParams: this.queryParams })
      break
    case 'invalidContent':
      this.showConformationModal(_event.row, _event.action)
      break
    case 'assignContent':
       this.openAssignlistPopup()
      break
    case 'reAssignContent':
      // this.showConformationModal(_event.row, _event.action)
      break
    case 'copyContent':
        this.queryParams = {
          id: _event.row.demand_id,
          name: 'copy',
        }
          this.router.navigate(['/app/home/create-request-form'], { queryParams: this.queryParams })
      break
  }

  }

  onChangePage(event: any) {
  this.pageNo = event.pageIndex
  this.pageSize = event.pageSize
  this.getRequestList()
  }

  showConformationModal(_selectedRow: any, _type: any) {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: {
        type: 'conformation',
        icon: 'radio_on',
        title: (_type === 'invalidContent') ? 'Are you sure you want to mark this as invalid.' :
          (_type === 'publishContent') ? 'Are you sure you want to publish the plan?' : '',
        subTitle: '',
        primaryAction: 'Yes',
        secondaryAction: 'No',
      },
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res === 'confirmed') {
        if (_type === 'invalidContent') {
          this.invalidContent(_selectedRow)
        }
        //  else if (_type === 'publishContent') {
        //   this.publishContentData(_selectedRow)
        // }
      }
    })
  }

  invalidContent(row: any) {
   const request = {
    demand_id: row.demand_id,
    newStatus: 'Invalid',
   }
   this.homeService.markAsInvalid(request).subscribe(res => {
     this.invalidRes = res
     this.getRequestList()
    }
  )

  }

  openAssignlistPopup() {
    this.dialogRef = this.dialog.open(AssignListPopupComponent, {
      disableClose: false,
      width: '90%',
      height: '70vh',
      data: {},
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res === 'confirmed') {
        // if (_type === 'invalidContent') {
        //   this.invalidContent(_selectedRow)
        // }
        //  else if (_type === 'publishContent') {
        //   this.publishContentData(_selectedRow)
        // }
      }
    })
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  getRequestList() {
    const request = {
        filterCriteriaMap: {},
        requestedFields: [],
        facets: [],
        pageNumber: this.pageNo,
        pageSize: this.pageSize,
        orderBy: 'createdOn',
        orderDirection: 'ASC',
    }
    this.homeService.getRequestList(request).subscribe(res => {
      this.requestListData = res.data
      if (this.requestListData) {
      this.requestCount = res.totalCount
        this.requestListData.map((data: any) => {
          if (data.createdOn) {
            data.createdOn = this.datePipe.transform(data.createdOn, 'MMM d, y')
          }
          if (data.assignedProvider) {
            data.assignedProvider = data.assignedProvider.providerName
          }
          if (data.status === 'Unassigned') {
           this.isUnassigned =  true
          } else if (data.status === 'Assigned') {
           this.isAssigned =  true
          } else if (data.status === 'Inprogress') {
            this.inProgress =  true
           } else if (data.status === 'invalid') {
            this.invalid =  true
           }
        })

      }

    })

  }

  viewDetails(e: any) {
    this.detailsEvent = e
  }

}
