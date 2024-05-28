import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILeftMenu } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ValueService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { Subscription } from 'rxjs'
/* tslint:enable */
@Component({
  selector: 'ws-app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  currentRoute = 'users'
  myRoles!: Set<string>
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  elementPosition: any
  sticky = false
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  createUserForm: FormGroup
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  department: any = {}
  departmentName = ''
  channelName = ''
  toastSuccess: any
  rolesList: any = []
  rolesObject: any = []
  uniqueRoles: any = []
  public userRoles: Set<string> = new Set()
  configService: any
  routeSubscription: Subscription | null = null
  qpParam: any
  qpPath: any
  breadcrumbs: any
  disableCreateButton = false
  displayLoader = false
  emailLengthVal = false
  isMdoAdmin = false
  isMdoLeader = false
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private usersSvc: UsersService,
    private valueSvc: ValueService) {
    this.configService = this.activeRoute.snapshot.data.configService
    if (this.configService.userRoles) {
      this.myRoles = this.configService.userRoles
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.urlAfterRedirects.replace('/app/home/', ''))
        if (_.get(this.activeRoute.snapshot, 'data.profileData.data')) {

          const leftData = this.activeRoute.snapshot.data.pageData.data.menus
          _.set(leftData, 'widgetData.logo', true)
          _.set(leftData, 'widgetData.logoPath', _.get(this.activeRoute, 'snapshot.data.profileData.data.rootOrg.imgUrl'))
          _.set(leftData, 'widgetData.name', _.get(this.activeRoute, 'snapshot.data.profileData.data.channel')
            || _.get(this.activeRoute, 'snapshot.data.profileData.data.rootOrg.description'))
          _.set(leftData, 'widgetData.userRoles', this.myRoles)
          this.widgetData = leftData
        } else {
          const leftData = this.activeRoute.snapshot.data.pageData.data.menus
          const fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
          _.set(leftData, 'widgetData.name', fullProfile ? fullProfile.unMappedUser.rootOrg.orgName : '')
          this.widgetData = leftData
        }
      }
    })
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
        this.department = fullProfile.unMappedUser.rootOrgId
        this.channelName = fullProfile ? fullProfile.unMappedUser.channel : ''
        this.departmentName = fullProfile ? fullProfile.unMappedUser.rootOrg.orgName : ''
        const orgLst = _.get(this.activeRoute.snapshot, 'data.rolesList.data.orgTypeList')

        if (this.configService.unMappedUser && this.configService.unMappedUser.roles) {
          this.isMdoAdmin = this.configService.unMappedUser.roles.includes('MDO_ADMIN')
          this.isMdoLeader = this.configService.unMappedUser.roles.includes('MDO_LEADER')
        }

        // new code
        for (let i = 0; i < orgLst.length; i += 1) {
          if (orgLst[i].name === 'MDO') {
            _.each(orgLst[i].roles, rolesObject => {
              if (this.isMdoAdmin) {
                if (rolesObject === 'PUBLIC') {
                  this.uniqueRoles.push({
                    roleName: rolesObject, description: rolesObject,
                  })
                }
                if (rolesObject === 'MDO_DASHBOARD_USER') {
                  this.uniqueRoles.push({
                    roleName: rolesObject, description: rolesObject,
                  })
                }
              } else {
                if (this.isMdoLeader) {
                  if (rolesObject !== 'MDO_LEADER') {
                    this.uniqueRoles.push({
                      roleName: rolesObject, description: rolesObject,
                    })
                  }
                }
              }
            })
          }
        }

        this.uniqueRoles.forEach((role: any) => {
          if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
            this.rolesList.push(role)
          }
        })

        /// old code
        /* tslint:disable-next-line */

        // const filteredDept = _.compact(_.map(orgLst, ls => {
        //   const f = _.filter(ls.flags, (fl: any) => fullProfile.unMappedUser.rootOrg[fl])
        //   if (f && f.length > 0) {
        //     return ls
        //   }
        //   return null
        // }))
        // const rolesListFull = _.uniq(_.map(_.compact(_.flatten(_.map(filteredDept, 'roles'))),
        //  rol => ({ roleName: rol, description: rol })))

        // rolesListFull.forEach((role: any) => {
        //   if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
        //     this.rolesList.push(role)
        //   }
        // })

        if (this.configService.userProfile && this.configService.userProfile.departmentName) {
          this.configService.userProfile.departmentName = this.departmentName
        }
      }
    })
    this.routeSubscription = this.activeRoute.queryParamMap.subscribe(qParamsMap => {
      this.qpParam = qParamsMap.get('param')
      this.qpPath = qParamsMap.get('path')

      if (this.qpParam === 'MDOinfo') {
        // tslint:disable-next-line:max-line-length
        this.breadcrumbs = { titles: [{ title: 'Home', url: '/app/home' }, { title: 'MDO information', url: '/app/home/mdoinfo/leadership' }, { title: 'New User', url: 'none' }] }
      } else {
        // tslint:disable-next-line:max-line-length
        this.breadcrumbs = { titles: [{ title: 'Users', url: '/app/home/users' }, { title: 'Active', url: 'none' }, { title: 'New User', url: 'none' }] }
      }
    })
    this.createUserForm = new FormGroup({
      fname: new FormControl('', [Validators.required]),
      // lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern), Validators.maxLength(12)]),
      department: new FormControl(''),
      roles: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  emailVerification(emailId: string) {
    this.emailLengthVal = false
    if (emailId && emailId.length > 0) {
      const email = emailId.split('@')
      if (email && email.length === 2) {
        if ((email[0] && email[0].length > 64) || (email[1] && email[1].length > 255)) {
          this.emailLengthVal = true
        }
      } else {
        this.emailLengthVal = false
      }
    }
  }

  onSubmit(form: any) {
    this.disableCreateButton = true
    this.displayLoader = true
    const newobj = {
      personalDetails: {
        email: form.value.email,
        phone: form.value.mobileNumber,
        userName: form.value.fname,
        firstName: form.value.fname,
        // lastName: form.value.lname,
        channel: this.channelName ? this.channelName : null,
        roles: form.value.roles,
      },
    }

    this.usersSvc.createUser(newobj).subscribe(res => {
      if (res) {
        this.displayLoader = false
        this.openSnackbar('User Created Successfully')
        this.disableCreateButton = false
        if (this.qpParam === 'MDOinfo') {
          this.router.navigate(['/app/home/mdoinfo/leadership'])
        } else {
          this.router.navigate(['/app/home/users'])
        }
        // const dreq = {
        //   request: {
        //     organisationId: this.department,
        //     userId: res.userId,
        //     roles: form.value.roles,
        //   },
        // }

        // this.usersSvc.addUserToDepartment(dreq).subscribe(dres => {
        //   if (dres) {
        //     this.createUserForm.reset({ fname: '', email: '', department: this.departmentName, roles: '' })
        //     // this.createUserForm.reset({ fname: '', lname: '', email: '', department: this.departmentName, roles: '' })
        //     this.openSnackbar('User Created Successfully')
        //     this.disableCreateButton = false
        //     if (this.qpParam === 'MDOinfo') {
        //       this.router.navigate(['/app/home/mdoinfo/leadership'])
        //     } else {
        //       this.router.navigate(['/app/home/users'])
        //     }
        //   }
        // },
        //   // tslint:disable-next-line
        //   (err: any) => {
        //     this.displayLoader = false
        //     this.openSnackbar(err.error || err || `Some error occurred while updateing new user's role, Please try again later!`)
        //   })
      }
    },
      // tslint:disable-next-line
      (err: any) => {
        this.displayLoader = false
        this.disableCreateButton = false
        if (err.error.params.errmsg) {
          if (err.error.params.errmsg === 'phone already exists') {
            this.openSnackbar('Phone Number already exists')
          } else if (err.error.params.errmsg === 'email already exists') {
            this.openSnackbar('Email Id already exists')
          } else if (err.error.params.errmsg === 'Invalid format for given phone.') {
            this.openSnackbar('Please enter valid phone number')
          } else {
            this.openSnackbar('Some error occurred while creating user, Please try again later!')
          }
        } else {
          this.openSnackbar('Some error occurred while creating user, Please try again later!')
        }
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  navigateTo() {
    this.router.navigate([`/app/home/users`])
  }
}
