import { Component, OnInit, Input } from '@angular/core'
import { PageEvent } from '@angular/material'

@Component({
  selector: 'ws-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent implements OnInit {

  @Input() totalRecords = 100
  pageSize = 20
  constructor() { }

  ngOnInit() {
  }

  handleChangePage(_event: PageEvent): void {
    // console.log('event - ', event)

  }

}
