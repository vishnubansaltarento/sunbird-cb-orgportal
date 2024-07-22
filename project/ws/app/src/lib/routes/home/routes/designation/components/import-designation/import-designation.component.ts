import { Component, OnDestroy, OnInit } from '@angular/core'
import { DesignationsService } from '../../services/designations.service'
import { MatDialog, PageEvent } from '@angular/material'
import { FormControl } from '@angular/forms'
import { delay, map } from 'rxjs/operators'
import { SelectedDesignationPopupComponent } from '../../dialog-boxes/selected-designation-popup/selected-designation-popup.component'
import { forkJoin, Subscription } from 'rxjs'
// import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
import { LoaderService } from '../../../../../../../../../../../src/app/services/loader.service'
import { Router } from '@angular/router'
// import { environment } from '../../../../../../../../../../../src/environments/environment'
import { ConformationPopupComponent } from '../../dialog-boxes/conformation-popup/conformation-popup.component'

@Component({
  selector: 'ws-app-import-designation',
  templateUrl: './import-designation.component.html',
  styleUrls: ['./import-designation.component.scss'],
})
export class ImportDesignationComponent implements OnInit, OnDestroy {

  environmentVal: any
  designationConfig: any
  frameworkConfig: any
  configSvc: any
  loaderMsg = ''
  showCreateLoader = false
  searchControl = new FormControl()
  igotDesignationsList: any = []
  selectedDesignationsList: any = []
  orgDesignationsList: any = []
  pageSize = 20
  startIndex = 0
  lastIndex = 20
  deisgnationsCount = 0
  private apiSubscription: Subscription | undefined
  designationsImportSuccessResponses: any = []
  importedDesignationNames: any = []
  designationsImportFailed: any = []
  frameworkInfo: any = {}

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    // private activateRoute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit() {

    // this.getRoutesData()
    this.loadDesignations()
    this.valudChangeSubscribers()

    this.getFrameWorkDetails()
  }

  // getRoutesData() {
  //   this.environmentVal = environment
  //   this.activateRoute.data.subscribe(data => {
  //     this.designationConfig = data.pageData.data
  //     this.frameworkConfig = this.designationConfig.frameworkConfig
  //   })

  //   this.configSvc = this.activateRoute.snapshot.data['configService']
  //   console.log('this.configSvc', this.configSvc.orgReadData)
  //   if (this.configSvc.orgReadData && this.configSvc.orgReadData.frameworkid) {
  //     this.environmentVal.frameworkName = this.configSvc.orgReadData.frameworkid
  //   } else {
  //     this.createFramework()
  //   }
  // }

  // createFramework() {
  //   this.showCreateLoader = true
  //   this.loaderMsg = this.designationConfig.frameworkCreationMSg
  //   this.environmentVal.frameworkName = '1231231231_organisation_fw'
  // }

  getFrameWorkDetails() {
    this.frameworkInfo = this.designationsService.frameWorkInfo
    if (this.frameworkInfo === undefined) {
      this.navigateToMyDesignations()
    }
  }

  loadDesignations(searchKey: string = '') {
    this.loaderService.changeLoaderState(true)
    const pageNumber = this.startIndex === 0 ? 0 : this.startIndex / this.pageSize
    const requestParams: any = {
      pageNumber,
      filterCriteriaMap: {
        status: 'Active',
      },
      requestedFields: [],
      pageSize: this.pageSize,
    }
    // this.startIndex
    if (searchKey) {
      requestParams['searchString'] = searchKey
    }

    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
      this.apiSubscription = undefined
    }

    this.apiSubscription = this.designationsService.getIgotMasterDesignations(requestParams).subscribe(
      (result: any) => {
        this.igotDesignationsList = result.formatedDesignationsLsit
        this.deisgnationsCount = result.totalCount
        this.loaderService.changeLoaderState(false)
      },
      (_err: any) => {
        this.loaderService.changeLoaderState(false)
      })
  }

  get getFilteredSelectedList() {
    if (this.searchControl.value) {
      return this.selectedDesignationsList
        .filter((designation: any) =>
          designation.name.toLowerCase().includes(this.searchControl.value.toLowerCase()))
    }
    return this.selectedDesignationsList
  }

  valudChangeSubscribers() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(delay(500)).subscribe((value: string) => {
        this.loadDesignations(value)
      })
    }
  }

  selectDesignation(checked: Boolean, id: number) {
    const index = this.igotDesignationsList.findIndex((e: any) => e.id === id)
    const designation = this.igotDesignationsList[index]
    if (checked) {
      designation['selected'] = true
      this.selectedDesignationsList.push(designation)
      this.designationsService.updateSelectedDesignationList(this.selectedDesignationsList)
      // this.igotDesignationsList.splice(index, 1)
      // this.igotDesignationsList.unshift(designation)
    } else {
      this.removeDesignation([designation])
    }
  }

  get selctedDesignationsCount() {
    return this.selectedDesignationsList.length
  }

  removeDesignation(designationToRemoveList: any[]) {
    designationToRemoveList.forEach((designationToRemove: any) => {
      this.selectedDesignationsList = this.selectedDesignationsList
        .filter((selectedDesignation: any) => selectedDesignation.id !== designationToRemove.id)
      this.designationsService.updateSelectedDesignationList(this.selectedDesignationsList)

      const igotListIndex = this.igotDesignationsList
        .findIndex((designation: any) => designation.id === designationToRemove.id)
      if (igotListIndex >= 0) {
        const designation = this.igotDesignationsList[igotListIndex]
        designation['selected'] = false
        // this.displayList.splice(igotListIndex, 1)
        // this.displayList.splice(this.selctedDesignationsCount, 0, designation)
      }
    })

  }

  openPreviewPoup() {
    const dialogData = JSON.parse(JSON.stringify(this.selectedDesignationsList))
    const dialogRef = this.dialog.open(SelectedDesignationPopupComponent, {
      disableClose: true,
      data: dialogData,
      autoFocus: false,
      maxHeight: '90vh',
      width: '90%',
    })
    dialogRef.afterClosed().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        // this.selectedDesignationsList
        this.removeDesignation(res)
      }
    })
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = pe.pageIndex * pe.pageSize
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize
    this.pageSize = pe.pageSize
    this.loadDesignations(this.searchControl.value)
  }

  importDesignations() {
    // this.designationsImportFailed = [
    //   {
    //     designation: {
    //       designation: 'name 1'
    //     }
    //   },
    //   {
    //     designation: {
    //       designation: 'name 2'
    //     }
    //   }
    // ]

    // this.importedDesignationNames = ['succes one', 'success two', 'succes one', 'success two', 'succes one', 'success two',
    //   'succes one', 'success two', 'succes one', 'success two', 'succes one', 'success two', 'succes one', 'success two',]
    // this.openConforamtionPopup()

    if (this.selctedDesignationsCount) {
      const observables = this.selectedDesignationsList.map((selectedDesignation: any) => {
        const requestBody = {
          name: selectedDesignation.designation,
          code: this.designationsService.getUuid,
          description: selectedDesignation.description,
          refId: selectedDesignation.id,
          refType: 'designation',
          category: 'designation',
          status: 'Live',
          framework: _.get(this.frameworkInfo, 'code'),
        }
        this.designationsImportSuccessResponses =
          _.get(this.frameworkInfo, 'categories[0].terms[0].associations', []).map((c: any) => {
            return c.identifier ? { identifier: c.identifier } : null
          })
        return this.designationsService.createTerm(requestBody).pipe(
          map(response => {
            this.designationsImportSuccessResponses.push({ identifier: _.get(response, 'result.node_id[0]') })
            this.importedDesignationNames.push(selectedDesignation.designation)
            return response
          }),
          // catchError(error => {
          //   this.designationsImportFailed.push({ designation: selectedDesignation, error })
          //   return of(null)
          // })
        )
      })

      forkJoin(observables).subscribe({
        next: response => {
          if (response) {
            this.updateTerms()
          }
        },
        // error: (error: HttpErrorResponse) => {
        //   const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        //   console.log(errorMessage)
        // },
      })
    }
  }

  updateTerms() {
    const framework = _.get(this.frameworkInfo, 'code')
    const category = _.get(this.frameworkInfo, 'categories[0].terms[0].category')
    const categoryTermCode = _.get(this.frameworkInfo, 'categories[0].terms[0].code')
    const requestBody = {
      request: {
        term: {
          associations: this.designationsImportSuccessResponses,
        },
      },
    }
    this.designationsService.updateTerms(framework, category, categoryTermCode, requestBody).subscribe({
      next: response => {
        if (response) {
          this.publishFrameWork()
        }
      },
      // error: (error: HttpErrorResponse) => {
      //   const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
      //   console.log(errorMessage)
      // },
    })
  }

  publishFrameWork() {
    const frameworkName = _.get(this.frameworkInfo, 'code')
    this.designationsService.publishFramework(frameworkName).subscribe({
      next: response => {
        // console.log('publish', response)
        if (response) {
          this.openConforamtionPopup()
        }
      },
      // error: (error: HttpErrorResponse) => {
      //   const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
      //   console.log(errorMessage)
      // },
    })
  }

  openConforamtionPopup() {
    const descriptions = []
    if (this.designationsImportFailed.length > 0) {
      const designationNames = this.designationsImportFailed.map((e: any) => e.designation.designation).join(', ')
      const description = {
        header: 'Import failed designations',
        messages: [
          {
            msgClass: '',
            msg: 'Some thing went wrong while importing ',
          },
          {
            msgClass: 'textBold',
            msg: `${designationNames}`,
          },
          {
            msgClass: '',
            msg: ' designations',
          },
        ],
      }
      descriptions.push(description)
    }
    if (this.importedDesignationNames.length > 0) {
      const designationNames = this.importedDesignationNames.join(', ')
      const description = {
        header: 'Designations imported successfully',
        messages: [
          {
            msgClass: 'textBold',
            msg: `${designationNames}`,
          },
          {
            msgClass: '',
            msg: ' are imported successfully',
          },
        ],
      }
      descriptions.push(description)
    }

    descriptions.push({
      messages: [
        {
          msgClass: '',
          msg: 'The changes will reflect shortly.',
        },
      ],
    })
    const dialogData = {
      descriptions,
      footerClass: 'items-center justify-end',
      buttons: [
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
      width: '600px',
      maxWidth: '80vw',
      maxHeight: '90vh',
      minHeight: '300px',
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(() => {
      this.navigateToMyDesignations()
    })
  }

  navigateToMyDesignations() {
    this.route.navigateByUrl('app/home/org-designations')
  }

  ngOnDestroy(): void {
    this.designationsService.updateSelectedDesignationList([])
    this.loaderService.changeLoaderState(false)
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
    }
  }
}
