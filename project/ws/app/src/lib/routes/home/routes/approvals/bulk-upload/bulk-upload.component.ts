import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { MatSnackBar, PageEvent } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { FileService } from '../../../../users/services/upload.service'

@Component({
  selector: 'ws-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent implements OnInit, OnDestroy {

  lastUploadList: any[] = []
  private destroySubject$ = new Subject()
  @Input() totalRecords = 100
  pageSize = 20
  constructor(
    private fileService: FileService,
    private matSnackBar: MatSnackBar,
    private router: ActivatedRoute
  ) {
    this.router.data.subscribe((_data: any) => { })
  }

  ngOnInit() {
    this.getBulkStatusList()
  }

  getBulkStatusList(): void {
    this.fileService.getBulkApprovalUploadDataV1()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.lastUploadList = res.result.content
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open("Unable to get Bulk status list")
        }
      })
  }

  handleDownloadFile(listObj: any): void {
    const filePath = `/apis/proxies/v8/workflow/admin/bulkuploadfile/download/${listObj.filename}`
    window.open(filePath, '_blank')
  }

  handleChangePage(_event: PageEvent): void {
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
