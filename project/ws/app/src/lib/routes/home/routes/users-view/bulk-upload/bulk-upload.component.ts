import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { MatSnackBar, PageEvent, MatDialog } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { FileService } from '../../../../users/services/upload.service'
import { UsersService } from '../../../../users/services/users.service'
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component'
import { FileProgressComponent } from '../file-progress/file-progress.component'

@Component({
  selector: 'ws-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent implements OnInit, OnDestroy {

  lastUploadList: any[] = []
  private destroySubject$ = new Subject()
  @Input() totalRecords = 100
  downloadSampleFilePath = ''
  downloadAsFileName = ''
  rootOrgId: any
  pageSize = 20
  showFileError = false
  public fileName: any
  fileSelected!: any
  userProfile: any

  constructor(
    private fileService: FileService,
    private matSnackBar: MatSnackBar,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    // this.router.data.subscribe((_data: any) => { })
    this.rootOrgId = _.get(this.router.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.userProfile = _.get(this.router.snapshot.parent, 'data.configService.userProfileV2')
    this.router.data.subscribe(data => {
      if (data && data.pageData) {
        this.downloadSampleFilePath = data.pageData.data.downloadSampleFilePath
        this.downloadAsFileName = data.pageData.data.downloadAsFileName
      }
    })
  }

  ngOnInit() {
    this.getBulkStatusList()
    this.showFileUploadProgress()
  }

  getBulkStatusList(): void {
    this.fileService.getBulkUploadDataV1(this.rootOrgId)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.lastUploadList = res.result.content
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open('Unable to get Bulk status list')
        }
      })
  }

  showFileUploadProgress(): void {
    this.dialog.open(FileProgressComponent, {
      data: {},
      disableClose: true,
      panelClass: 'progress-modal',
    })
  }

  handleDownloadFile(listObj: any): void {
    const filePath = `/apis/proxies/v8/workflow/admin/bulkuploadfile/download/${listObj.filename}`
    window.open(filePath, '_blank')
  }

  handleDownloadSampleFile(): void {
    this.fileService.download(this.downloadSampleFilePath, this.downloadAsFileName)
  }

  handleFileClick(event: any): void {
    event.target.value = ''
  }

  sendOTP(): void {
    this.generateAndVerifyOTP(this.userProfile.mobile ? 'phone' : 'email')
  }

  generateAndVerifyOTP(contactType: string, resendFlag?: string): void {
    this.usersService.sendOtp(this.userProfile.mobile, contactType)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackBar.open(`An OTP has been sent to your ${contactType === 'phone' ? 'Mobile number'
          : 'Email address'}, (Valid for 15 min's)`)
        if (resendFlag) {
          this.verifyOTP(contactType)
        }
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(_.get(error, 'error.params.errmsg') || `Unable to send OTP to your ${contactType}, please try again later!`)
        }
      })
  }

  handleOnFileChange(event: any): void {
    this.showFileError = false
    const fileList = (<HTMLInputElement>event.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.fileName = file.name
      this.fileSelected = file
      this.sendOTP()
    }
  }

  verifyOTP(contactType: string): void {
    const dialogRef = this.dialog.open(VerifyOtpComponent, {
      data: { type: contactType },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.componentInstance.resendOTP.subscribe((data: any) => {
      this.generateAndVerifyOTP(data.type, 'resend')
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.showFileUploadProgress()
      }
    })
  }

  handleChangePage(_event: PageEvent): void {

  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
