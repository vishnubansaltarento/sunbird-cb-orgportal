import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
// import { environment } from 'src/environments/environment'
import { PageEvent } from '@angular/material/paginator';
import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { UsersService } from '../../../users/services/users.service'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// import { ProfileV2UtillService } from '../../services/home-utill.service'
import { ReportsVideoComponent } from '../reports-video/reports-video.component'

@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-col' },
  /* tslint:enable */
})
export class UsersViewComponent implements OnInit, OnDestroy {
  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'allusers'
  // filterPath = '/app/home/users'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  userDetails: any
  location!: string | null
  tabs: any
  isLoading = false
  // tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: any
  connectionRequests!: any[]
  data: any = []
  usersData!: any
  configSvc: any
  activeUsersData!: any[]
  verifiedUsersData!: any[]
  nonverifiedUsersData!: any[]
  notmyuserUsersData!: any[]

  activeUsersDataCount?: number | 0
  verifiedUsersDataCount?: number | 0
  nonverifiedUsersDataCount?: number | 0
  notmyuserUsersDataCount?: number | 0
  content: NsContent.IContent = {} as NsContent.IContent
  isMdoAdmin = false

  reportsNoteList: string[] = []

  currentOffset = 0
  limit = 20
  pageIndex = 0
  searchQuery = ''
  rootOrgId: any
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    // private snackBar: MatSnackBar,
    private events: EventService,
    private loaderService: LoaderService,
    // private profileUtilSvc: ProfileV2UtillService,
    private sanitizer: DomSanitizer,
    // private telemetrySvc: TelemetryService,
    // private configSvc: ConfigurationsService,
    // private discussService: DiscussService,
    // private configSvc: ConfigurationsService,
    // private networkV2Service: NetworkV2Service,
    // private profileV2Svc: ProfileV2Service
    private usersService: UsersService
  ) {
    this.Math = Math
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId

    // this.usersData = _.get(this.route, 'snapshot.data.usersList.data') || {}
    // this.filterData()
  }

  ngOnDestroy() {
    // if (this.tabs) {
    //   this.tabs.unsubscribe()
    // }
  }
  ngOnInit() {
    this.currentFilter = this.route.snapshot.params['tab'] || 'allusers'
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.searchQuery = ''
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.roles) {
      this.isMdoAdmin = this.configSvc.unMappedUser.roles.includes('MDO_ADMIN')
    }
    // this.filterData('')

    this.getAllUsers('')
    this.getVUsers('')
    this.getNVUsers('')
    this.getNMUsers('')

    this.reportsNoteList = [
      `Easily create users individually or in bulk.`,
      `Edit any user profile within your organization.`,
      `Verified Users: Users with all their primary fields approved.`,
      // tslint:disable-next-line: max-line-length
      `Non-Verified Users: Users whose one or more primary fields are yet to be approved. You can help by reviewing and approving their requests.`,
      `Not My User: Remove a user from your organization with a simple click.`,
    ]
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  openVideoPopup() {
    this.dialog.open(ReportsVideoComponent, {
      data: {
        videoLink: 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1',
      },
      disableClose: true,
      width: '50%',
      height: '60%',
      panelClass: 'overflow-visable',
    })
  }

  filter(filter: string) {
    this.currentFilter = filter
    this.pageIndex = 0
    this.currentOffset = 0
    this.limit = 20
    this.searchQuery = ''
    this.filterData(this.searchQuery)
  }

  public tabTelemetry(label: string, index: number) {
    const data: TelemetryEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.events.handleTabTelemetry(
      TelemetryEvents.EnumInteractSubTypes.USER_TAB,
      data,
    )
  }

  filterData(query: string) {
    // this.getUsers(query, this.currentFilter)
    if (this.currentFilter === 'allusers') {
      this.getAllUsers(query)
    } else if (this.currentFilter === 'verified') {
      this.getVUsers(query)
    } else if (this.currentFilter === 'nonverified') {
      this.getNVUsers(query)
    } else if (this.currentFilter === 'notmyuser') {
      this.getNMUsers(query)
    }
  }

  showEditUser(roles: any): boolean {
    if (this.isMdoAdmin) {
      if (roles && roles.length > 0) {
        return true
        //   return (roles.includes('PUBLIC') && roles.length === 1)
      }
      // return false
    }
    return true
  }

  // blockedUsers() {
  //   const blockedUsersData: any[] = []
  //   if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
  //     _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
  //       blockedUsersData.push({
  //         fullname: user ? `${user.firstName}` : null,
  //         // fullname: user ? `${user.firstName} ${user.lastName}` : null,
  //         email: user.personalDetails && user.personalDetails.primaryEmail ?
  //           this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
  //         role: user.roles,
  //         userId: user.id,
  //         active: !user.isDeleted,
  //         blocked: user.blocked,
  //         roles: _.join(_.map(user.roleInfo, i => `<li>${i}</li>`), ''),
  //       })
  //     })
  //   }
  //   return blockedUsersData
  // }

  async getAllUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    // const usersData: any[] = []
    const filtreq = {
      rootOrgId: this.rootOrgId,
      status: 1,
    }

    this.usersService.getAllKongUsers(filtreq, this.limit, this.pageIndex, query).subscribe((data: any) => {
      const allusersData = data.result.response
      this.activeUsersData = allusersData.content
      this.activeUsersDataCount = data.result.response.count
    })
  }
  async getVUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const filtreq = {
      rootOrgId: this.rootOrgId,
      'profileDetails.profileStatus': 'VERIFIED',
    }

    this.usersService.getAllKongUsers(filtreq, this.limit, this.pageIndex, query).subscribe((data: any) => {
      const allusersData = data.result.response
      this.verifiedUsersData = allusersData.content
      this.verifiedUsersDataCount = data.result.response.count
    })
  }

  async getNVUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const filtreq = {
      rootOrgId: this.rootOrgId,
      'profileDetails.profileStatus': 'NOT-VERIFIED',
    }

    this.usersService.getAllKongUsers(filtreq, this.limit, this.pageIndex, query).subscribe((data: any) => {
      const allusersData = data.result.response
      this.nonverifiedUsersData = allusersData.content
      this.nonverifiedUsersDataCount = data.result.response.count
    })
  }

  async getNMUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const filtreq = {
      rootOrgId: this.rootOrgId,
      'profileDetails.profileStatus': 'NOT-MY-USER',
    }

    this.usersService.getAllKongUsers(filtreq, this.limit, this.pageIndex, query).subscribe((data: any) => {
      const allusersData = data.result.response
      this.notmyuserUsersData = allusersData.content
      this.notmyuserUsersDataCount = data.result.response.count
    })
  }

  clickHandler(event: any) {
    switch (event.type) {
      case 'createUser':
        this.onCreateClick()
        break
      case 'upload':
        this.onUploadClick()
        break
    }
  }

  onCreateClick() {
    this.router.navigate([`/app/users/create-user`])
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CREATE_BTN,
        id: 'create-user-btn',
      },
      {}
    )
  }

  onUploadClick() {
    this.filter('upload')
  }

  onRoleClick(user: any) {
    this.router.navigate([`/app/users/${user.userId}/details`])
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: TelemetryEvents.EnumIdtype.USER_ROW,
      },
      {
        id: user.userId,
        type: TelemetryEvents.EnumIdtype.USER,
      }
    )
  }

  onEnterkySearch(enterValue: any) {
    this.searchQuery = enterValue
    this.filterData(this.searchQuery)
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.filterData(this.searchQuery)
  }
}
