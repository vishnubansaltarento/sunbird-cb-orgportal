import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }
  requestList: any[] = [
    `These reports contain Personally Identifiable Information (PII) data.
      Please use them cautiously.`,
      `Your access to the report is available until.
      Please contact your MDO Leader to renew your access.`,
  ]

  ngOnInit() {
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

}
