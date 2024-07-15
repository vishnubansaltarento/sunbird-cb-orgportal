import { Component, OnInit } from '@angular/core'
import { OdcsService } from '../../services/odcs.service'
import * as _ from 'lodash'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'

@Component({
  selector: 'ws-app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {

  frameworkDetails: any = {}
  organisationsList: any = []
  selectedOrganisation: string = ''
  designationsList: any = []
  tableData!: ITableData
  showLoader: boolean = true
  actionMenuItem: {
    name: string,
    icon: string,
    key: string,
    isMdoLeader: boolean
  }[] = []

  constructor(
    private odcsService: OdcsService,
  ) { }

  ngOnInit() {
    this.initialization()
  }

  //#region (intial actions)
  initialization() {
    this.initializeDefaultValues()
    this.getFrameworkInfo()
  }

  initializeDefaultValues() {
    this.actionMenuItem = [
      {
        name: 'Edit',
        icon: 'edit',
        key: 'edit',
        isMdoLeader: true //ws-widget-org-user-table library has conditions
      },
      {
        name: 'View',
        icon: 'remove_red_eye',
        key: 'view',
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
    // this.odcsService.getFrameworkInfo().subscribe(res => {
    //   this.showLoader = false
    //   this.frameworkDetails = _.get(res, 'result.framework')
    //   this.getOrganisations()
    //   console.log('frame work: ', this.frameworkDetails)
    // })
  }

  getOrganisations() {
    this.organisationsList = this.getTermsOfCategorie('organisation_fw_org')
    this.selectedOrganisation = _.get(this.organisationsList, '[0].identifier', '')
    this.getDesignations()
  }

  getDesignations() {
    this.designationsList = this.getTermsOfCategorie('organisation_fw_designation')
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

  //#region (ui interactions like click)

  openDesignationCreatPopup(event?: any) {
    console.log('event', event)
    const dialogData = {
      mode: 'create',
      columnInfo: {
        code: 'designation',
        name: 'Designation',
        children: this.designationsList,
      },
      frameworkId: 'organisation_fw',
      selectedDesignation: null
    }
    if (event && event.action) {
      dialogData.mode = event.action
      dialogData.selectedDesignation = event.row
    }
  }

  upload() { }

  menuSelected(event: any) {
    switch (event.action) {
      case 'edit':
        this.openDesignationCreatPopup(event)
        break
      case 'view':
        this.openDesignationCreatPopup(event)
        break
    }
  }

  //#endregion



}
