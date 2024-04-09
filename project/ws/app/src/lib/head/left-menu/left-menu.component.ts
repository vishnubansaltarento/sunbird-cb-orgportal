import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
// import { ILeftMenu, IMenu } from './left-menu-v1.model'
// import { defaultImg } from './img.json'
@Component({
  selector: 'ws-widget-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {
  @Input() widgetData!: any
  mdoname: any
  logo: any
  menulist = [
    {
      "menuCategory": "Home",
      "requiredRoles": [
        "admin",
        "mdo_admin",
        "wat_member",
        "mdo_leader"
      ],
      "subMenu": [
        {
          "name": "Home",
          "key": "Home",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/welcome",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "wat_member",
            "mdo_leader"
          ]
        }
      ]
    },
    {
      "menuCategory": "Users",
      "requiredRoles": [
        "admin",
        "mdo_admin",
        "mdo_leader"
      ],
      "subMenu": [
        {
          "name": "All Users",
          "key": "users",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/users",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        },
        {
          "name": "Approvals",
          "key": "approvals",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/approvals/pending",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        }
      ]
    },
    {
      "menuCategory": "Manage",
      "requiredRoles": [
        "admin",
        "mdo_admin",
        "mdo_leader"
      ],
      "subMenu": [
        {
          "name": "Roles and access",
          "key": "roles-access",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/roles-access",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        },
        {
          "name": "Organisation profile",
          "key": "orgProfile",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/setup",
          "requiredRoles": [
            "isInstuteOrg"
          ]
        },
        {
          "name": "Blended program",
          "key": "blended-approvals",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/blended-approvals",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        },
        {
          "name": "Reports",
          "key": "reports-section",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/reports-section",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        },
        {
          "name": "Training Plan",
          "key": "training-plan-dashboard",
          "fragment": false,
          "render": true,
          "badges": {
            "enabled": false,
            "uri": ""
          },
          "enabled": true,
          "routerLink": "/app/home/training-plan-dashboard",
          "requiredRoles": [
            "admin",
            "mdo_admin",
            "mdo_leader"
          ]
        }
      ]
    }
  ]
  // @Input() Source
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void { }

  ngOnInit(): void {
    console.log('widgetData', this.widgetData)
    this.mdoname = this.widgetData ? this.widgetData.name : ''
    this.logo = this.widgetData ? this.widgetData.logoPath : './assets/icons/govtlogo.jpg'
  }

  // changeToDefaultImg($event: any) {
  //   $event.target.src = defaultImg
  // }
  public isLinkActive(url?: string, index?: number): boolean {
    let returnVal = false
    if (url && index) {
      returnVal = (this.activatedRoute.snapshot.fragment === url)
    } else if (index === 0) {
      returnVal = true
    } else {
      returnVal = false
    }
    return returnVal
  }
  public isLinkActive2(url?: string): boolean {
    let returnval = false
    if (url) {
      const st = this.router.url.split('?')
      if (st && st[0] && st[0] === (url)) {
        returnval = true
      }
      // if(route.url.con)
    }
    return returnval
  }
  getLink(tab: any) {
    if (tab && tab.customRouting && this.activatedRoute.snapshot && this.activatedRoute.snapshot.firstChild && tab.paramaterName) {
      return (tab.routerLink.replace('<param>', this.activatedRoute.snapshot.firstChild.params[tab.paramaterName]))
    }
    return
  }

  isAllowed(tab: any): boolean {
    let returnValue = false
    if (tab.requiredRoles && tab.requiredRoles.length > 0) {
      (tab.requiredRoles).forEach((v: any) => {
        if ((this.widgetData.userRoles || new Set()).has(v)) {
          returnValue = true
        }
      })
    } else {
      returnValue = true
    }
    console.log('returnValue', returnValue)
    return returnValue
  }
}
