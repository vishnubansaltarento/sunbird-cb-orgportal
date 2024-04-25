import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UsersService } from '../../../users/services/users.service'
import { MatChipInputEvent, MatPaginator, PageEvent } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
// tslint:disable-next-line
import _ from 'lodash'
import { RolesService } from '../../../users/services/roles.service'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'

@Component({
  selector: 'ws-widget-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
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
  masterLanguages: Observable<any[]> | undefined
  masterLanguagesEntries: any
  genderList = ['Male', 'Female', 'Others']
  categoryList = ['General', 'OBC', 'SC', 'ST', 'Others']

  constructor(private usersSvc: UsersService, private roleservice: RolesService,
    private route: ActivatedRoute, private cdref: ChangeDetectorRef) {
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', []),
      group: new FormControl('', []),
      tags: new FormControl('', [Validators.pattern(this.namePatern)]),
      roles: new FormControl('', [Validators.required]),
      domicileMedium: new FormControl('', []),
      gender: new FormControl('', []),
      category: new FormControl('', []),
      primaryEmail: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.currentFilter = this.route.snapshot.params['tab'] || 'allusers'
    this.init()
  }

  async init() {
    await this.loadDesignations()
    await this.loadGroups()
    await this.loadLangauages()
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

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      this.updateUserDataForm.controls['designation'].setValue(value)

      console.log('this.updateUserDataForm', this.updateUserDataForm)
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
    // this.usersData.content.forEach((u: any) => {
    //   if (u.userId === user.userId && user.editUser === false) {

    this.cdref.detectChanges()
    user.editUser = !user.editUser
    console.log('user-----', user)
    //   }
    // })
  }

  getUerData(user: any) {
    user.editUser = true
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
      const usrRoles = profileDataAll.roles
      usrRoles.forEach((role: any) => {
        this.orguserRoles.push(role)
        this.modifyUserRoles(role)
      })
    })
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
    if ((value && value.trim()) && this.updateUserDataForm.valid) {
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
}
