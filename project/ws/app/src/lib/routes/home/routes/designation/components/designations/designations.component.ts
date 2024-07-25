import { Component, OnInit } from '@angular/core'
import * as _ from 'lodash'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { DesignationsService } from '../../services/designations.service'
import { FormControl } from '@angular/forms'
import { delay } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ConformationPopupComponent } from '../../dialog-boxes/conformation-popup/conformation-popup.component'
import { ActivatedRoute } from '@angular/router'
import { environment } from '../../../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss'],
})
export class DesignationsComponent implements OnInit {

  environment: any
  designationConfig: any
  configSvc: any
  loaderMsg = ''
  showCreateLoader = false
  searchControl = new FormControl()
  frameworkDetails: any = {}
  organisationsList: any = []
  selectedOrganisation = ''
  designationsList: any = []
  filteredDesignationsList: any = []
  tableData!: ITableData
  showLoader = false
  actionMenuItem: {
    name: string,
    icon: string,
    key: string,
    isMdoLeader: boolean
  }[] = []
  orgId = ''

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initialization()
  }

  //#region (intial actions)
  initialization() {
    this.initializeDefaultValues()
    this.valudChangeSubscribers()
    this.getRoutesData()
  }

  initializeDefaultValues() {
    this.configSvc = this.activateRoute.snapshot.data['configService']
    this.designationsService.setUserProfile(_.get(this.configSvc, 'userProfileV2'))
    this.orgId = _.get(this.configSvc, 'userProfile.rootOrgId')
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
        isMdoLeader: true,
      },
    ]

    this.tableData = {
      columns: [
        { displayName: 'Designation', key: 'name' },
        { displayName: 'Imported by', key: 'importedByName' },
        { displayName: 'Imported on', key: 'importedOn' },
      ],
      needCheckBox: false,
      needHash: false,
      needUserMenus: false,
      actions: [],
      actionColumnName: 'Action',
      cbpPlanMenu: true,
    }
  }

  getRoutesData() {
    this.environment = environment
    this.activateRoute.data.subscribe(data => {
      this.designationConfig = data.pageData.data
    })

    // console.log('this.configSvc', this.configSvc.orgReadData)
    if (this.configSvc.orgReadData && this.configSvc.orgReadData.frameworkid) {
      // this.environmentVal.frameworkName = this.configSvc.orgReadData.frameworkid
      this.getFrameworkInfo(this.configSvc.orgReadData.frameworkid)
    } else {
      this.createFreamwork()
    }
  }

  createFreamwork() {
    this.showCreateLoader = true
    this.loaderMsg = this.designationConfig.frameworkCreationMSg
    const departmentName = _.get(this.configSvc, 'userProfile.departmentName').replace(/\s/g, '')
    const masterFrameWorkName = this.environment.ODCSMasterFramework
    this.designationsService.createFrameWork(masterFrameWorkName, this.orgId, departmentName).subscribe((res: any) => {
      if (res) {
        this.getOrgReadData()
      }
      // console.log('frameworkCreated: ', res)
    })
  }

  getOrgReadData() {
    this.designationsService.getOrgReadData(this.orgId).subscribe((res: any) => {
      if (_.get(res, 'frameworkid')) {
        this.showLoader = true
        this.showCreateLoader = false
        this.environment.frameworkName = _.get(res, 'frameworkid')
        this.getFrameworkInfo(res.frameworkid)
      } else {
        setTimeout(() => {
          this.getOrgReadData()
        },         10000)
      }
      // console.log('orgFramework Details', res)
    })
  }

  getFrameworkInfo(frameworkid: string) {
    this.showLoader = true
    this.environment.frameworkName = frameworkid
    this.designationsService.getFrameworkInfo(frameworkid).subscribe(res => {
      this.showLoader = false
      this.frameworkDetails = _.get(res, 'result.framework')
      this.designationsService.setFrameWorkInfo(this.frameworkDetails)

      this.getOrganisations()
      // console.log('frame work: ', this.frameworkDetails)
    })
  }

  valudChangeSubscribers() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(delay(500)).subscribe({
        next: response => {
          this.filterDesignations(response)
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
          this.openSnackbar(errorMessage)
        },
      })
    }
  }

  getOrganisations() {
    this.organisationsList = this.getTermsByCode('org')
    this.selectedOrganisation = _.get(this.organisationsList, '[0].identifier', '')
    this.getDesignations()
  }

  getDesignations() {
    this.designationsList = this.getTermsByCode('designation')
    this.designationsService.setCurrentOrgDesignationsList(this.designationsList)
    this.filterDesignations()
  }

  // to get list from categories like designations, organisations
  getTermsByCode(code: string) {
    const selectedCatagori = this.categoriesOfFramework.filter((catagori: any) => catagori.code === code)
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
    // console.log('envent data', event)
    const dialogData = {
      descriptions: [
        {
          header: '',
          messages: [
            {
              msgClass: '',
              msg: `Are you sure you want to remove the ${_.get(event, 'row.name')} designation?`,
            },
          ],
        },
      ],
      footerClass: 'items-center justify-end',
      buttons: [
        {
          btnText: 'Remove',
          btnClass: 'btn-full-red',
          response: true,
        },
        {
          btnText: 'Cancel',
          btnClass: '',
          response: false,
        },
      ],
    }
    const dialogRef = this.dialog.open(ConformationPopupComponent, {
      data: dialogData,
      autoFocus: false,
      width: '500px',
      maxWidth: '80vw',
      maxHeight: '90vh',
      height: '300px',
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        // this.removeDesignation(event.row)
      }
    })
  }

  // removeDesignation(designation: any) {
  //   console.log(designation)
  // }

  private openSnackbar(primaryMsg: any, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  //#endregion

  // openVideoPopup() { }

}
