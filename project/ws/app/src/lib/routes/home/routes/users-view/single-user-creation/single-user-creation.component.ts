import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatSnackBar } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'

import { UsersService } from '../../../../users/services/users.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/

@Component({
  selector: 'ws-single-user-creation',
  templateUrl: './single-user-creation.component.html',
  styleUrls: ['./single-user-creation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SingleUserCreationComponent implements OnInit, OnDestroy {

  private destroySubject$ = new Subject()
  masterData: any = {}
  userCreationForm = this.formBuilder.group({
    fullName: new FormControl('', [Validators.required]),
    primaryEmail: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
    mobile: new FormControl('', [Validators.required, Validators.pattern(MOBILE_PATTERN), Validators.minLength(10)]),
    organization: new FormControl(''),
    designation: new FormControl(''),
    group: new FormControl(''),
    dob: new FormControl(''),
    domicileMedium: new FormControl(''),
    gender: new FormControl(''),
    pincode: new FormControl('', [Validators.pattern(PIN_CODE_PATTERN)]),
    category: new FormControl(''),
    tags: new FormControl([]),
    roles: new FormControl([], [Validators.required]),
  })
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private matSnackBar: MatSnackBar
  ) {
    if (this.userCreationForm.get('designation')) {
      // tslint:disable-next-line
      this.userCreationForm.get('designation')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (this.masterData && this.masterData.designation) {
            this.masterData.designation = this.masterData.designationBackup.filter((item: any) =>
              item.name.toLowerCase().includes(res && res.toLowerCase()))
          }
        })
    }

    if (this.userCreationForm.get('domicileMedium')) {
      // tslint:disable-next-line
      this.userCreationForm.get('domicileMedium')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (this.masterData && this.masterData.language) {
            this.masterData.language = this.masterData.languageBackup.filter((item: any) =>
              item.name.toLowerCase().includes(res && res.toLowerCase()))
          }
        })
    }
  }

  ngOnInit() {
    this.getDesignation()
    this.getMasterLanguages()
    this.getGroups()
  }

  getDesignation(): void {
    this.usersService.getDesignations()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.masterData['designation'] = _res.responseData
        this.masterData['designationBackup'] = _res.responseData
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  getMasterLanguages(): void {
    this.usersService.getMasterLanguages()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterData['language'] = res.languages
        this.masterData['languageBackup'] = res.languages
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch master language details, please try again later!')
        }
      })
  }

  getGroups(): void {
    this.usersService.getGroups()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterData['group'] = res.result.response
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch group data, please try again later!')
        }
      })
  }

  handleFormClear(): void {
    this.userCreationForm.reset()
  }

  ngOnDestroy(): void {

  }

}
