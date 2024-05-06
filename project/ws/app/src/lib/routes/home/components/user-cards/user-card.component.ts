import { Component, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UsersService } from '../../../users/services/users.service'
import {
  DateAdapter, MAT_DATE_FORMATS, MatChipInputEvent, MatDialog,
  MatExpansionPanel, MatPaginator, MatSnackBar, PageEvent,
} from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
// tslint:disable-next-line
import _ from 'lodash'
import { RolesService } from '../../../users/services/roles.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { environment } from '../../../../../../../../../src/environments/environment'
// import { OtpService } from '../../../users/services/otp.service'
// import { ConfigurationsService } from '@sunbird-cb/utils'
import { RejectionPopupComponent } from '../rejection-popup/rejection-popup.component'
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../events/routes/format-datepicker'
import { ApprovalsService } from '../../services/approvals.service'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'

@Component({
  selector: 'ws-widget-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class UserCardComponent implements OnInit {
  @Input() userId: any
  @Input() tableData: any
  @Input() usersData: any
  @Input() totalRecords: any
  @Input() tabChangeIndex: any
  @Input() currentFilter: any
  @Input() isApprovals: any

  @Output() paginationData = new EventEmitter()
  @Output() searchByEnterKey = new EventEmitter()
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>
  @ViewChild('approveDialog', { static: false })
  approveDialog!: TemplateRef<any>
  @ViewChild('rejectDialog', { static: false })
  rejectDialog!: TemplateRef<any>

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
  approveUserDataForm: FormGroup
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
  needApprovalList: any[] = []
  profileData: any[] = []
  userwfData!: any
  comment = ''
  listupdateFieldValues: any[] = []
  actionList: any = []

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
  approvalData: any

  constructor(private usersSvc: UsersService, private roleservice: RolesService,
              private dialog: MatDialog, private router: Router, private approvalSvc: ApprovalsService,
              private route: ActivatedRoute, private snackBar: MatSnackBar,
              private events: EventService) {
    // this.route.data.subscribe((data: any) => {
    //   this.profileData = data.pageData.data.profileData
    // })
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      employeeID: new FormControl({ value: '', disabled: true }, []),
      ehrmsID: new FormControl({ value: '', disabled: true }, []),
      dob: new FormControl('', [Validators.required]),
      primaryEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailRegix)]),
      countryCode: new FormControl('+91', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      tags: new FormControl('', [Validators.pattern(this.namePatern)]),
      roles: new FormControl('', [Validators.required]),
      domicileMedium: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
    })

    this.approveUserDataForm = new FormGroup({
      approveDesignation: new FormControl('', []),
      approveGroup: new FormControl('', []),
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

    if (this.isApprovals && this.usersData && this.usersData.length > 0) {
      this.approvalData = this.usersData
      this.getUserMappedData(this.approvalData)

      this.approvalSvc.getProfileConfig().then((res: any) => {
        this.profileData = res && res.profileData
      })
    } else {
      this.init()
    }
  }

  // for approvals
  async getUserMappedData(approvalData: any) {
    approvalData.forEach((data: any) => {
      const id = data.userWorkflow.userInfo.wid
      this.usersSvc.getUserById(id).subscribe((res: any) => {
        if (res) {
          data.user = res
        }
      })
    })
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
    user.enableEdit = true
    this.setUserDetails(user)
  }

  getUerData(user: any, data: any) {
    user.enableEdit = false
    const profileDataAll = user
    this.userStatus = profileDataAll.isDeleted ? 'Inactive' : 'Active'

    const profileData = profileDataAll.profileDetails
    this.updateTags(profileData)

    if (this.isApprovals) {
      this.needApprovalList = []
      this.actionList = []
      this.comment = ''
      this.getApprovalList(data)
    }

    this.roleservice.getAllRoles().subscribe((_data: any) => {
      const parseRoledata = JSON.parse(_data.result.response.value)
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
      const usrRoles = profileDataAll.organisations[0] && profileDataAll.organisations[0].roles
        ? profileDataAll.organisations[0].roles : []
      if (usrRoles.length > 0) {
        usrRoles.forEach((role: any) => {
          this.orguserRoles.push(role)
          this.modifyUserRoles(role)
        })
      }
    })
  }

  setUserDetails(user: any) {
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
          // this.updateUserDataForm.controls['group'].setValue(user.profileDetails.additionalProperties.group)
          this.updateUserDataForm.patchValue({
            group: user.profileDetails.additionalProperties.group,
          })
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
        if (user.profileDetails.employmentDetails.employeeCode) {
          this.updateUserDataForm.controls['employeeID'].setValue(user.profileDetails.employmentDetails.employeeCode)

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

  getApprovalList(approvalData: any) {
    this.userwfData = approvalData
    if (approvalData.wfInfo && approvalData.wfInfo.length > 0) {
      approvalData.wfInfo.forEach((wf: any) => {
        if (typeof wf.updateFieldValues === 'string') {
          const fields = JSON.parse(wf.updateFieldValues)
          if (fields.length > 0) {
            fields.forEach((field: any) => {
              const labelKey = Object.keys(field.toValue)[0]
              const feildNameObj = this.profileData.filter(userData => userData.key === labelKey)[0]
              if (labelKey === 'designation' || labelKey === 'group') {
                this.needApprovalList.push(
                  Object.assign({
                    wf,
                    feildName: labelKey,
                    label: feildNameObj ? feildNameObj.name : null,
                    value: field.toValue[labelKey],
                    fieldKey: field.fieldKey,
                    wfId: wf.wfId,
                  })
                )
              }
            })
          }
        }
      })
    }
  }

  cancelSubmit() {
    this.updateUserDataForm.reset()
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

  // sendOtp() {
  //   const mob = this.updateUserDataForm.get('mobile')
  //   if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
  //     this.otpService.sendOtp(mob.value).subscribe(() => {
  //       this.otpSend = true
  //       alert('An OTP has been sent to your mobile number')
  //       this.startCountDown()
  //       // tslint:disable-next-line: align
  //     }, (error: any) => {
  //       this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
  //     })
  //   } else {
  //     this.snackBar.open('Please enter a valid mobile number')
  //   }
  // }
  // resendOTP() {
  //   const mob = this.updateUserDataForm.get('mobile')
  //   if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
  //     this.otpService.resendOtp(mob.value).subscribe((res: any) => {
  //       if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
  //         this.otpSend = true
  //         this.disableVerifyBtn = false
  //         alert('An OTP has been sent to your mobile number')
  //         this.startCountDown()
  //       }
  //       // tslint:disable-next-line: align
  //     }, (error: any) => {
  //       this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
  //     })
  //   } else {
  //     this.snackBar.open('Please enter a valid mobile number')
  //   }
  // }
  // verifyOtp(otp: any) {
  //   const mob = this.updateUserDataForm.get('mobile')
  //   if (otp && otp.value) {
  //     if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
  //       this.otpService.verifyOTP(otp.value, mob.value).subscribe((res: any) => {
  //         if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
  //           this.otpVerified = true
  //           const reqUpdates = {
  //             request: {
  //               userId: this.configSvc.unMappedUser.id,
  //               profileDetails: {
  //                 personalDetails: {
  //                   mobile: mob.value,
  //                   phoneVerified: true,
  //                 },
  //               },
  //             },
  //           }
  //           this.usersSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {

  //             if (updateRes) {
  //               this.isMobileVerified = true
  //             }
  //             // tslint:disable-next-line:align
  //           }, (error: any) => {

  //             this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
  //           }
  //           )
  //         }
  //         // tslint:disable-next-line: align
  //       }, (error: any) => {
  //         this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
  //         if (error.error && error.error.result) {
  //           this.disableVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
  //         }
  //       })
  //     }
  //   }
  // }
  // startCountDown() {
  //   const startTime = Date.now()
  //   this.timeLeftforOTP = this.OTP_TIMER
  //   if (this.OTP_TIMER > 0
  //   ) {
  //     this.timerSubscription = interval(1000)
  //       .pipe(
  //         map(
  //           () =>
  //             startTime + this.OTP_TIMER - Date.now(),
  //         ),
  //       )
  //       .subscribe((_timeRemaining: any) => {
  //         this.timeLeftforOTP -= 1
  //         if (this.timeLeftforOTP < 0) {
  //           this.timeLeftforOTP = 0
  //           if (this.timerSubscription) {
  //             this.timerSubscription.unsubscribe()
  //           }
  //         }
  //       })
  //   }
  // }

  addRejection(field: any) {
    const rejectinDetails = {
      field,
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

  // updateRejection() {
  //   const rejectinDetails = {
  //     header: {
  //       headerText: 'Reason of rejection',
  //       showEditButton: true,
  //     },
  //     body: {
  //       reason: `You're not in Group C.Please provide the request with the correct entry.`,
  //       placeholder: 'Type the decription in fewer than 100 characters',
  //       showTextArea: false,
  //     },
  //     footer: {
  //       showFooter: false,
  //       buttons: [
  //         {
  //           btnType: 'submit',
  //           btnText: 'Update',
  //           response: true,
  //         },
  //         {
  //           btnType: 'cancel',
  //           btnText: 'Cancel',
  //           response: false,
  //         },
  //       ],
  //     },
  //   }

  //   const dialogRef = this.dialog.open(RejectionPopupComponent, {
  //     data: rejectinDetails,
  //     width: '1100px',
  //     disableClose: true,
  //     panelClass: 'rejection-modal',
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.btnResponse) {
  //       // console.log(result)
  //     }
  //   })
  // }

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
                pinCode: this.updateUserDataForm.controls['pincode'].value,
              },
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

            this.usersSvc.addUserToDepartment(dreq).subscribe(res => {
              if (res) {
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

  // for approval & rejection
  onClickHandleWorkflow(field: any, action: string) {
    field.action = action
    const req = {
      action,
      comment: '',
      state: 'SEND_FOR_APPROVAL',
      userId: field.wf.userId,
      applicationId: field.wf.applicationId,
      actorUserId: this.userwfData.userInfo.wid,
      wfId: field.wf.wfId,
      serviceName: 'profile',
      updateFieldValues: JSON.parse(field.wf.updateFieldValues),
    }
    if (action === 'APPROVE') {
      this.actionList.push(req)
      // this.onApproveOrRejectClick(req)
    } else {
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.onApproveOrRejectClick(req)
          req.comment = this.comment
          this.actionList.push(req)
        } else {
          dialogRef.close()
        }
      })
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: field.wf.applicationId,
        type: TelemetryEvents.EnumIdtype.APPLICATION,
      }
    )
  }

  // single aprrove or reject
  onApproveOrRejectClick(req: any) {
    req.comment = this.comment
    this.approvalSvc.handleWorkflow(req).subscribe((res: any) => {
      if (res.result.data) {
        if (res.result.data.status === 'REJECTED') {
          this.openSnackbar('Request Rejected Successfully')
        } else {
          this.openSnackbar('Request Approved')
        }
        this.comment = ''
        // this.needApprovalList = this.needApprovalList.filter(wf => wf.wfId !== res.result.data.wfIds[0])
      }
    })
  }

  onApprovalSubmit() {
    // console.log('this.actionList', this.actionList)
    if (this.actionList.length > 0) {
      this.actionList.forEach((req: any) => {
        this.onApproveOrRejectClick(req)
      })
    }
  }

  updateRejection(field: any) {
    const dialogRef = this.dialog.open(this.rejectDialog, {
      width: '770px',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionList.forEach((req: any) => {
          if (req.wfId === field.wfId) {
            req.comment = this.comment
          }
        })
      } else {
        dialogRef.close()
      }
    })

  }

  onClickAllHandleWorkflow(approvalList: any[], action: string) {
    let user1Id = ''
    let application1Id = ''

    if (approvalList && approvalList.length > 0) {
      approvalList.forEach(approvalItem => {
        user1Id = approvalItem.wf.userId
        application1Id = approvalItem.wf.applicationId
      })
    }
    if (action === 'APPROVE') {
      // const dialogRef = this.dialog.open(this.approveDialog, {
      //   width: '770px',
      // })
      // dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      const req: any = {
        action,
        state: 'SEND_FOR_APPROVAL',
        userId: user1Id,
        actorUserId: this.userwfData.userInfo.wid,
        serviceName: 'profile',
      }
      if (approvalList.length > 0) {
        approvalList.forEach((approvalAttribute: any) => {
          this.listupdateFieldValues = JSON.parse(approvalAttribute.wf.updateFieldValues)
          req['applicationId'] = approvalAttribute.wf.applicationId
          req['wfId'] = approvalAttribute.wf.wfId
          req['updateFieldValues'] = this.listupdateFieldValues
          this.onApproveOrRejectClick(req)
        })
      }
      // } else {
      //   dialogRef.close()
      // }
      // })
    } else {
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const req: any = {
            action,
            state: 'SEND_FOR_APPROVAL',
            userId: user1Id,
            actorUserId: this.userwfData.userInfo.wid,
            serviceName: 'profile',
          }

          if (approvalList.length > 0) {
            approvalList.forEach((approvalAttribute: any) => {
              this.listupdateFieldValues = JSON.parse(approvalAttribute.wf.updateFieldValues)
              req['applicationId'] = approvalAttribute.wf.applicationId
              req['wfId'] = approvalAttribute.wf.wfId
              req['updateFieldValues'] = this.listupdateFieldValues
              this.onApproveOrRejectClick(req)
            })
          }
        } else {
          dialogRef.close()
        }
      })
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: application1Id,
        type: TelemetryEvents.EnumIdtype.APPLICATION,

      }
    )
  }
}
