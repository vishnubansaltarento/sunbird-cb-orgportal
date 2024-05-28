import { Component, OnInit, OnDestroy } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-public-contact',
  templateUrl: './public-contact.component.html',
  styleUrls: ['./public-contact.component.scss'],
})
export class PublicContactComponent implements OnInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'iGOT'
  panelOpenState = false
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null

  constructor(private configSvc: ConfigurationsService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      if (data && data.pageData && data.pageData.data) {
        this.contactPage = data.pageData.data
      }

    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }

  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
  }
}
