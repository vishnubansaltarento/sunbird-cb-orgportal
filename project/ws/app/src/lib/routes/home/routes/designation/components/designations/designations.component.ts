import { Component, OnInit } from '@angular/core'
import * as _ from 'lodash'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { DesignationsService } from '../../services/designations.service'
import { FormControl } from '@angular/forms'
import { delay } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material'
import { ConformationPopupComponent } from '../../dialog-boxes/conformation-popup/conformation-popup.component'


@Component({
  selector: 'ws-app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {

  searchControl = new FormControl();
  frameworkDetails: any = {}
  organisationsList: any = []
  selectedOrganisation: string = ''
  designationsList: any = []
  filteredDesignationsList: any = []
  tableData!: ITableData
  showLoader: boolean = true
  actionMenuItem: {
    name: string,
    icon: string,
    key: string,
    isMdoLeader: boolean
  }[] = []

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initialization()
  }

  //#region (intial actions)
  initialization() {
    this.initializeDefaultValues()
    this.getFrameworkInfo()
    this.valudChangeSubscribers()
  }

  initializeDefaultValues() {
    this.actionMenuItem = [
      // {
      //   name: 'Edit',
      //   icon: 'edit',
      //   key: 'edit',
      //   isMdoLeader: true //ws-widget-org-user-table library has conditions
      // },
      // {
      //   name: 'View',
      //   icon: 'remove_red_eye',
      //   key: 'view',
      //   isMdoLeader: true
      // }
      {
        name: 'Remove',
        icon: 'delete',
        key: 'remove',
        isMdoLeader: true
      }
    ]

    this.tableData = {
      columns: [
        { displayName: 'Designation', key: 'name' },
        { displayName: 'Description', key: 'description' },
      ],
      needCheckBox: false,
      needHash: false,
      needUserMenus: false,
      actions: [],
      actionColumnName: 'Action',
      cbpPlanMenu: true,
    }
  }

  getFrameworkInfo() {
    this.showLoader = true
    this.designationsService.getFrameworkInfo().subscribe(res => {
      this.showLoader = false
      this.frameworkDetails = _.get(res, 'result.framework')
      this.getOrganisations()
      console.log('frame work: ', this.frameworkDetails)
    })
  }

  valudChangeSubscribers() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(delay(500)).subscribe({
        next: response => {
          this.filterDesignations(response)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      })
    }
  }

  getOrganisations() {
    this.organisationsList = this.getTermsOfCategorie('organisation_fw_org')
    this.selectedOrganisation = _.get(this.organisationsList, '[0].identifier', '')
    this.getDesignations()
  }

  getDesignations() {
    this.designationsList = this.getTermsOfCategorie('organisation_fw_designation')
    this.filterDesignations()
  }

  // to get list from categories like designations, organisations
  getTermsOfCategorie(catagoriIdentifier: string) {
    const selectedCatagori = this.categoriesOfFramework.filter((catagori: any) => catagori.identifier === catagoriIdentifier)
    return _.get(selectedCatagori, '[0].terms', [])
  }

  // to get different categories list
  get categoriesOfFramework() {
    return _.get(this.frameworkDetails, 'categories', [])
  }

  //#endregion

  filterDesignations(key?: string) {
    if (key) {
      this.filteredDesignationsList = this.designationsList
        .filter((designation: any) => designation.name.toLowerCase().includes(key.toLowerCase()))
    } else {
      this.filteredDesignationsList = this.designationsList
    }
  }

  //#region (ui interactions like click)

  // openDesignationCreatPopup(event?: any) {
  //   console.log('event', event)
  //   const dialogData = {
  //     mode: 'create',
  //     columnInfo: {
  //       code: 'designation',
  //       name: 'Designation',
  //       children: this.designationsList,
  //     },
  //     frameworkId: 'organisation_fw',
  //     selectedDesignation: null
  //   }
  //   if (event && event.action) {
  //     dialogData.mode = event.action
  //     dialogData.selectedDesignation = event.row
  //   }
  // }

  // upload() { }

  menuSelected(event: any) {
    switch (event.action) {
      // case 'edit':
      //   this.openDesignationCreatPopup(event)
      //   break
      // case 'view':
      //   this.openDesignationCreatPopup(event)
      //   break
      case 'remove':
        this.openConformationPopup(event)
        break
    }
  }

  openConformationPopup(event: any) {
    console.log('envent data', event)
    const dialogData = {
      message: `Are you sure you want to remove the ${_.get(event, 'row.name')} designation?`
    }
    const dialogRef = this.dialog.open(ConformationPopupComponent, {
      data: dialogData,
      autoFocus: false,
      width: '500px',
      maxWidth: '80vw',
      disableClose: true
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.removeDesignation(event.row)
      }
    })
  }

  removeDesignation(designation: any) {
    console.log(designation)
  }

  //#endregion



}
