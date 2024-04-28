import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UsersService } from '../../../users/services/users.service'
import { DateAdapter, MAT_DATE_FORMATS, MatChipInputEvent, MatDialog, MatExpansionPanel, MatPaginator, MatSnackBar, PageEvent } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
// tslint:disable-next-line
import _ from 'lodash'
import { RolesService } from '../../../users/services/roles.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, Subscription, interval } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { environment } from '../../../../../../../../../src/environments/environment'
import { OtpService } from '../../../users/services/otp.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { RejectionPopupComponent } from '../rejection-popup/rejection-popup.component'
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../events/routes/format-datepicker'

@Component({
  selector: 'ws-widget-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ]
})
export class UserCardComponent implements OnInit {
  @Input() userId: any
  @Input() tableData: any
  @Input() usersData: any
  @Input() totalRecords: any
  @Input() tabChangeIndex: any
  @Input() currentFilter: any

  @Output() paginationData = new EventEmitter()
  @Output() searchByEnterKey = new EventEmitter()
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any
  startIndex = 0
  lastIndex = 20
  pageSize = 20

  userStatus: any
  rolesList: any = []
  rolesObject: any = []
  uniqueRoles: any = []
  public userRoles: Set<string> = new Set()
  orguserRoles: any = []
  isMdoAdmin = false
  isMdoLeader = false
  updateUserDataForm: FormGroup
  designationsMeta: any = []
  groupsList: any = []
  selectedtags: any[] = []
  reqbody: any
  isTagsEdited = false
  separatorKeysCodes: number[] = [ENTER, COMMA]
  namePatern = `^[a-zA-Z ]*$`
  orgTypeList: any = []
  public countryCodes: string[] = []
  masterLanguages: Observable<any[]> | undefined
  masterLanguagesEntries: any
  genderList = ['Male', 'Female', 'Others']
  categoryList = ['General', 'OBC', 'SC', 'ST', 'Others']

  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  pincodePattern = '(^[0-9]{6}$)'
  yearPattern = '(^[0-9]{4}$)'

  otpSend = false
  otpVerified = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  isMobileVerified = false
  disableVerifyBtn = false
  qpParam: any
  department: any

  constructor(private usersSvc: UsersService, private roleservice: RolesService,
    private configSvc: ConfigurationsService, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute, private otpService: OtpService,
    private snackBar: MatSnackBar) {
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      employeeID: new FormControl({ value: '', disabled: true }, []),
      ehrmsID: new FormControl({ value: '', disabled: true }, []),
      dob: new FormControl('', [Validators.required]),
      primaryEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailRegix)]),
      countryCode: new FormControl('+91', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      tags: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      roles: new FormControl('', [Validators.required]),
      domicileMedium: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
    })

    const fullProfile = _.get(this.route.snapshot, 'data.configService')
    this.department = fullProfile.unMappedUser.rootOrgId

    if (fullProfile.unMappedUser && fullProfile.unMappedUser.roles) {
      this.isMdoAdmin = fullProfile.unMappedUser.roles.includes('MDO_ADMIN')
      this.isMdoLeader = fullProfile.unMappedUser.roles.includes('MDO_LEADER')
    }
  }

  ngOnInit() {
    this.currentFilter = this.route.snapshot.params['tab'] || 'allusers'
    this.init()
  }

  async init() {
    await this.loadDesignations()
    await this.loadGroups()
    await this.loadLangauages()
    await this.loadCountryCodes()
  }

  async loadDesignations() {
    await this.usersSvc.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
  }

  async loadGroups() {
    await this.usersSvc.getGroups().subscribe(
      (data: any) => {
        const res = data.result.response
        res.map((value: any) => {
          this.groupsList.push({ name: value })
        })
      },
      (_err: any) => {
      })
  }

  async loadLangauages() {
    await this.usersSvc.getMasterLanguages().subscribe(
      (data: any) => {
        this.masterLanguagesEntries = data.languages
        this.onChangesLanuage()
      },
      (_err: any) => {
      })
  }

  async loadCountryCodes() {
    this.usersSvc.getMasterNationlity().subscribe((data: any) => {
      data.nationality.map((item: any) => {
        this.countryCodes.push(item.countryCode)
      })

      this.updateUserDataForm.patchValue({
        countryCode: '+91',
      })
    },
      (_err: any) => {
      })
  }

  closeOtherPanels(openPanel: MatExpansionPanel) {
    this.panels.forEach(panel => {
      if (panel !== openPanel) {
        panel.close()
      }
    })
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      this.updateUserDataForm.controls['designation'].setValue(value)
    }
  }

  onChangesLanuage(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterLanguages = this.updateUserDataForm.get('domicileMedium')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map((name: any) => name ? this.filterLanguage(name) : this.masterLanguagesEntries.slice()),
      )
  }

  private filterLanguage(name: string) {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterLanguagesEntries.filter((option: any) => option.name.toLowerCase().includes(filterValue))
    }
    return this.masterLanguagesEntries
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  onEditUser(user: any) {
    setTimeout(() => {
      user.enableEdit = false
    }, 5000)
    // this.cdref.detectChanges()
  }

  getUerData(user: any) {
    user.enableEdit = true
    const profileDataAll = user
    this.userStatus = profileDataAll.isDeleted ? 'Inactive' : 'Active'

    const profileData = profileDataAll.profileDetails
    this.updateTags(profileData)

    this.roleservice.getAllRoles().subscribe((data: any) => {
      const parseRoledata = JSON.parse(data.result.response.value)
      this.orgTypeList = parseRoledata.orgTypeList

      // New code for roles
      for (let i = 0; i < this.orgTypeList.length; i += 1) {
        if (this.orgTypeList[i].name === 'MDO') {
          _.each(this.orgTypeList[i].roles, rolesObject => {
            // if (this.isMdoAdmin) {
            //   if (rolesObject === 'PUBLIC') {
            //     this.uniqueRoles.push({
            //       roleName: rolesObject, description: rolesObject,
            //     })
            //   }
            //   if (rolesObject === 'MDO_DASHBOARD_USER') {
            //     this.uniqueRoles.push({
            //       roleName: rolesObject, description: rolesObject,
            //     })
            //   }
            // } else {
            // if (this.isMdoLeader) {
            if (rolesObject !== 'MDO_LEADER') {
              this.uniqueRoles.push({
                roleName: rolesObject, description: rolesObject,
              })
              // }
            }
            // }
          })
        }
      }
      this.uniqueRoles.forEach((role: any) => {
        if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
          this.rolesList.push(role)
        }
      })
      const usrRoles = profileDataAll.organisations[0].roles
      usrRoles.forEach((role: any) => {
        this.orguserRoles.push(role)
        this.modifyUserRoles(role)
      })
    })

    if (user && user.profileDetails) {
      // this.updateUserDataForm.controls['employeeID'].setValue('')
      // this.updateUserDataForm.controls['ehrmsID'].setValue('')
      if (user.profileDetails.professionalDetails) {
        if (user.profileDetails.professionalDetails.designation) {
          this.updateUserDataForm.controls['designation'].setValue(user.profileDetails.professionalDetails.designation)
        }
      }

      if (user.profileDetails.additionalProperties) {
        if (user.profileDetails.additionalProperties.group) {
          this.updateUserDataForm.controls['group'].setValue(user.profileDetails.additionalProperties.group)
        }
      }

      if (user.profileDetails.personalDetails) {
        if (user.profileDetails.personalDetails.primaryEmail) {
          this.updateUserDataForm.controls['primaryEmail'].setValue(user.profileDetails.personalDetails.primaryEmail)
        }
        if (user.profileDetails.personalDetails.mobile) {
          this.updateUserDataForm.controls['mobile'].setValue(user.profileDetails.personalDetails.mobile)
        }
        if (user.profileDetails.personalDetails.gender) {
          this.updateUserDataForm.controls['gender'].setValue(user.profileDetails.personalDetails.mobile)
        }
        if (user.profileDetails.personalDetails.dob) {
          this.updateUserDataForm.controls['dob'].setValue(user.profileDetails.personalDetails.dob)
        }
        if (user.profileDetails.personalDetails.domicileMedium) {
          this.updateUserDataForm.controls['domicileMedium'].setValue(user.profileDetails.personalDetails.domicileMedium)
        }
        if (user.profileDetails.personalDetails.category) {
          this.updateUserDataForm.controls['category'].setValue(user.profileDetails.personalDetails.category)
        }
      }

      if (user.profileDetails.employmentDetails) {
        if (user.profileDetails.employmentDetails.pinCode) {
          this.updateUserDataForm.controls['pincode'].setValue(user.profileDetails.employmentDetails.pincode)
        }
      }
    }
  }

  getUseravatarName(user: any) {
    let name = ''
    if (user && user.profileDetails && user.profileDetails.personalDetails.firstname) {
      name = `${user.profileDetails.personalDetails.firstname}`
    } else {
      name = `${user.firstName}`
    }
    return name
  }

  resetRoles() {
    this.updateUserDataForm.controls['roles'].setValue(this.orguserRoles)
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }

  updateTags(profileData: any) {
    this.selectedtags = _.get(profileData, 'additionalProperties.tag') || []
  }

  addActivity(event: MatChipInputEvent) {
    const input = event.input
    const value = event.value as string
    // if ((value && value.trim()) && this.updateUserDataForm.valid) {
    if ((value && value.trim())) {
      this.isTagsEdited = true
      this.selectedtags.push(value)
    }
    if (input) {
      input.value = ''
    }
    if (this.updateUserDataForm.get('tags')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.updateUserDataForm.get('tags')!.setValue(null)
    }
    this.updateUserDataForm.controls['tags'].reset()
  }

  removeActivity(interest: any) {
    const index = this.selectedtags.indexOf(interest)
    if (index >= 0) {
      this.selectedtags.splice(index, 1)
      this.isTagsEdited = true
    }
  }

  checkForChange(activityList: any) {
    const newobj: any = []
    activityList.forEach((val: any) => {
      const reqObj = {
        name: val,
      }
      newobj.push(reqObj)
    })
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = (pe.pageIndex) * pe.pageSize
    this.lastIndex = pe.pageSize
    this.paginationData.emit({ pageIndex: this.startIndex, pageSize: pe.pageSize })
    // this.startIndex = this.pageIndex
  }

  onSearch(event: any) {
    this.searchByEnterKey.emit(event)
  }

  sendOtp() {
    const mob = this.updateUserDataForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.otpService.sendOtp(mob.value).subscribe(() => {
        this.otpSend = true
        alert('An OTP has been sent to your mobile number')
        this.startCountDown()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }
  resendOTP() {
    const mob = this.updateUserDataForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.otpService.resendOtp(mob.value).subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
          this.disableVerifyBtn = false
          alert('An OTP has been sent to your mobile number')
          this.startCountDown()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }
  verifyOtp(otp: any) {
    // console.log(otp)
    const mob = this.updateUserDataForm.get('mobile')
    if (otp && otp.value) {
      if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
        this.otpService.verifyOTP(otp.value, mob.value).subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpVerified = true
            const reqUpdates = {
              request: {
                userId: this.configSvc.unMappedUser.id,
                profileDetails: {
                  personalDetails: {
                    mobile: mob.value,
                    phoneVerified: true,
                  },
                },
              },
            }
            this.usersSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {

              if (updateRes) {
                this.isMobileVerified = true
              }
              // tslint:disable-next-line:align
            }, (error: any) => {

              this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
            }
            )
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          if (error.error && error.error.result) {
            this.disableVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
          }
        })
      }
    }
  }
  startCountDown() {
    const startTime = Date.now()
    this.timeLeftforOTP = this.OTP_TIMER
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER > 0
    ) {
      this.timerSubscription = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER - Date.now(),
          ),
        )
        .subscribe((_timeRemaining: any) => {
          this.timeLeftforOTP -= 1
          if (this.timeLeftforOTP < 0) {
            this.timeLeftforOTP = 0
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  addRejection() {
    const rejectinDetails = {
      header: {
        headerText: 'Reason of rejection',
        showEditButton: false,
      },
      body: {
        reason: '',
        placeholder: 'Type the decription in fewer than 100 characters',
        showTextArea: true,
      },
      footer: {
        showFooter: true,
        buttons: [
          {
            btnType: 'submit',
            btnText: 'Submit',
            response: true,
          },
          {
            btnType: 'cancel',
            btnText: 'Cancel',
            response: false,
          },
        ],
      },
    }

    const dialogRef = this.dialog.open(RejectionPopupComponent, {
      data: rejectinDetails,
      width: '1100px',
      disableClose: true,
      panelClass: 'rejection-modal',
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result.btnResponse) {
        // console.log(result)
      }
    })
  }

  updateRejection() {
    const rejectinDetails = {
      header: {
        headerText: 'Reason of rejection',
        showEditButton: true,
      },
      body: {
        reason: `You're not in Group C.Please provide the request with the correct entry.`,
        placeholder: 'Type the decription in fewer than 100 characters',
        showTextArea: false,
      },
      footer: {
        showFooter: false,
        buttons: [
          {
            btnType: 'submit',
            btnText: 'Update',
            response: true,
          },
          {
            btnType: 'cancel',
            btnText: 'Cancel',
            response: false,
          },
        ],
      },
    }

    const dialogRef = this.dialog.open(RejectionPopupComponent, {
      data: rejectinDetails,
      width: '1100px',
      disableClose: true,
      panelClass: 'rejection-modal',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result.btnResponse) {
        // console.log(result)
      }
    })
  }

  onSubmit(form: any, user: any) {
    // console.log('user -------', user)
    // console.log('form *******', form)
    if (form.valid) {
      const tags = user.profileDetails && user.profileDetails.additionalProperties && user.profileDetails.additionalProperties.tags ?
        user.profileDetails.additionalProperties.tags : []
      if (tags !== this.selectedtags) {
        this.reqbody = {
          request: {
            userId: user.userId,
            profileDetails: {
              personalDetails: {
                dob: this.updateUserDataForm.controls['dob'].value,
                domicileMedium: this.updateUserDataForm.controls['domicileMedium'].value,
                gender: this.updateUserDataForm.controls['gender'].value,
                category: this.updateUserDataForm.controls['category'].value,
                mobile: this.updateUserDataForm.controls['mobile'].value,
                primaryEmail: this.updateUserDataForm.controls['primaryEmail'].value,
              },
              professionalDetails: [
                {
                  designation: this.updateUserDataForm.controls['designation'].value,
                  group: this.updateUserDataForm.controls['group'].value,
                },
              ],
              additionalProperties: {
                tag: this.selectedtags,
              },
              employmentDetails: {
                pinCode: this.updateUserDataForm.controls['pinCode'].value,
              }
            },
          },
        }
      } else {
        this.reqbody = {
          request: {
            userId: user.userId,
            profileDetails: {
              professionalDetails: [
                {
                  designation: this.updateUserDataForm.controls['designation'].value,
                },
              ],
            },
          },
        }
      }
      this.usersSvc.updateUserDetails(this.reqbody).subscribe(dres => {
        if (dres) {
          this.openSnackbar('User updated Successfully')

          if (form.value.roles !== this.orguserRoles) {
            const dreq = {
              request: {
                organisationId: this.department,
                userId: user.userId,
                roles: Array.from(this.userRoles),
              },
            }

            this.usersSvc.addUserToDepartment(dreq).subscribe(dres => {
              if (dres) {
                this.updateUserDataForm.reset({ roles: '' })
                this.openSnackbar('User role updated Successfully')
                this.router.navigate(['/app/home/users/allusers'])
              }
            })
          } else {
            this.openSnackbar('Select new roles')
          }
        }
      })
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
