import { Component, OnDestroy, OnInit } from '@angular/core'
import { DesignationsService } from '../../services/designations.service'
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material'
import { FormControl } from '@angular/forms'
import { catchError, delay, map } from 'rxjs/operators'
import { SelectedDesignationPopupComponent } from '../../dialog-boxes/selected-designation-popup/selected-designation-popup.component'
import { forkJoin, of, Subscription } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
import { LoaderService } from '../../../../../../../../../../../src/app/services/loader.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfirmationBoxComponent } from '../../../../../training-plan/components/confirmation-box/confirmation.box.component'
import { DatePipe } from '@angular/common'
// import { environment } from '../../../../../../../../../../../src/environments/environment'
// import { ConformationPopupComponent } from '../../dialog-boxes/conformation-popup/conformation-popup.component'

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
  dialogRef: any

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private route: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.configSvc = this.activateRoute.snapshot.data['configService']
    this.loadDesignations()
    this.valudChangeSubscribers()

    this.getFrameWorkDetails()
  }

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
    if (this.selctedDesignationsCount) {
      this.openProcessingBox()
      const currentDate = this.datePipe.transform(new Date(), 'dd MMM, yyyy')
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
          additionalProperties: {
            importedByName: _.get(this.configSvc, 'userProfileV2.firstName'),
            importedById: _.get(this.configSvc, 'userProfileV2.userId'),
            importedOn: currentDate,
          },
        }
        this.designationsImportSuccessResponses =
          _.get(this.frameworkInfo, 'categories[0].terms[0].associations', []).map((c: any) => {
            return c.identifier ? { identifier: c.identifier } : null
          })
        return this.designationsService.createTerm(requestBody).pipe(
          map(response => {
            this.designationsImportSuccessResponses.push({ identifier: _.get(response, 'result.identifier[0]') })
            this.importedDesignationNames.push(selectedDesignation.designation)
            return response
          }),
          catchError(error => {
            this.designationsImportFailed.push({ error, designation: selectedDesignation })
            return of(null)
          })
        )
      })

      forkJoin(observables).subscribe({
        next: response => {
          if (response) {
            this.updateTerms()
          }
        },
        error: (error: HttpErrorResponse) => {
          this.dialogRef.close()
          const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
          this.openSnackbar(errorMessage)
        },
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
      error: (error: HttpErrorResponse) => {
        const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        this.dialogRef.close()
        this.openSnackbar(errorMessage)
      },
    })
  }

  publishFrameWork() {
    const frameworkName = _.get(this.frameworkInfo, 'code')
    this.designationsService.publishFramework(frameworkName).subscribe({
      next: response => {
        if (response) {
          this.dialogRef.close()
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        this.dialogRef.close()
        this.openSnackbar(errorMessage)
      },
    })
  }

  openProcessingBox() {
    const dialogData = {
      type: 'progress',
      icon: 'vega',
      title: 'Importing Your Designations',
      subTitle: 'Wait a second , your importing in processing….',
    }
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: dialogData,
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe(() => {
      this.openConforamtionPopup()
    })
  }

  openConforamtionPopup() {
    // const descriptions = []
    // if (this.designationsImportFailed.length > 0) {
    //   const designationNames = this.designationsImportFailed.map((e: any) => e.designation.designation).join(', ')
    //   const description = {
    //     header: 'Import failed designations',
    //     messages: [
    //       {
    //         msgClass: '',
    //         msg: 'Some thing went wrong while importing ',
    //       },
    //       {
    //         msgClass: 'textBold',
    //         msg: `${designationNames}`,
    //       },
    //       {
    //         msgClass: '',
    //         msg: ' designations',
    //       },
    //     ],
    //   }
    //   descriptions.push(description)
    // }
    // if (this.importedDesignationNames.length > 0) {
    //   const designationNames = this.importedDesignationNames.join(', ')
    //   const description = {
    //     header: 'Designations imported successfully',
    //     messages: [
    //       {
    //         msgClass: 'textBold',
    //         msg: `${designationNames}`,
    //       },
    //       {
    //         msgClass: '',
    //         msg: ' are imported successfully',
    //       },
    //     ],
    //   }
    //   descriptions.push(description)
    // }

    // descriptions.push({
    //   messages: [
    //     {
    //       msgClass: '',
    //       msg: 'The changes will reflect shortly.',
    //     },
    //   ],
    // })
    // const dialogData = {
    //   descriptions,
    //   footerClass: 'items-center justify-end',
    //   buttons: [
    //     {
    //       btnText: 'Cancel',
    //       btnClass: '',
    //       response: false,
    //     },
    //   ],
    // }

    // const dialogRef = this.dialog.open(ConformationPopupComponent, {
    //   data: dialogData,
    //   autoFocus: false,
    //   width: '600px',
    //   maxWidth: '80vw',
    //   maxHeight: '90vh',
    //   disableClose: true,
    // })
    // dialogRef.afterClosed().subscribe(() => {
    //   this.navigateToMyDesignations()
    // })
    const successMessage = 'Imported Successfully '
    this.openSnackbar(successMessage, 10000)
    this.navigateToMyDesignations()
  }

  navigateToMyDesignations() {
    this.route.navigateByUrl('app/home/org-designations')
  }

  private openSnackbar(primaryMsg: any, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  ngOnDestroy(): void {
    this.designationsService.updateSelectedDesignationList([])
    this.loaderService.changeLoaderState(false)
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
    }
  }
}
