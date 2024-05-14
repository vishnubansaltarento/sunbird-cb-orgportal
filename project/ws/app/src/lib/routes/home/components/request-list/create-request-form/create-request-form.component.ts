import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ProfileV2Service } from '../../../services/home.servive'

@Component({
  selector: 'ws-app-create-request-form',
  templateUrl: './create-request-form.component.html',
  styleUrls: ['./create-request-form.component.scss'],
})
export class CreateRequestFormComponent implements OnInit {
  requestForm!: FormGroup
  specialCharList = `( a-z/A-Z , 0-9 . _ - $ / \ : [ ]' ' !)`
  // tslint:disable-next-line:max-line-length
  noSpecialChar = new RegExp(/^[\u0900-\u097F\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0B00-\u0B7F\u0A00-\u0A7Fa-zA-Z0-9()$[\]\\.:,_/ -]*$/)
  learningList = ['Self-paced', 'Instructor-led']
  requestTypeList = ['Single', 'Broadcast']
  competencyList: any[] = []
  allCompetencyTheme: any[] = []
  seletedCompetencyArea: any
  seletedCompetencyTheme: any = []
  allCompetencySubtheme: any[] = []
  seletedCompetencySubTheme: any[] = []
  requestTypeData: any[] = []
  isAssignee = false
  isBroadCast = false
  filterCompetencyThemes: any[] = []
  filteredSubTheme: any[] = []
  filteredRequestType: any[] = []
  subthemeCheckedList: any[] = []
  resData=''

  constructor(private formBuilder: FormBuilder,
    private homeService: ProfileV2Service,
  ) {
    this.requestForm = this.formBuilder.group({
      TitleName: new FormControl('', [Validators.required, Validators.pattern(this.noSpecialChar), Validators.minLength(10)]),
      Objective:  new FormControl('', [Validators.required, Validators.pattern(this.noSpecialChar)]),
      userType:  new FormControl('', [Validators.pattern(this.noSpecialChar)]),
      learningMode:  new FormControl(''),
      compArea: new FormControl(''),
      compTheme: new FormControl(''),
      compSubTheme: new FormControl(''),
      referenceLink: new FormControl(''),
      requestType: new FormControl('', Validators.required),
      assignee: new FormControl(''),
      providers: new FormControl(''),
      themeText: new FormControl(''),
      subthemeText: new FormControl(''),
      providerText: new FormControl(''),
    })

   }

  ngOnInit() {
    this.getFilterEntity()
    this.getRequestTypeList()

  }

  searchValueData(e: any, searchValue: any) {
    if (searchValue === 'themeText') {
      this.requestForm.controls['themeText'].valueChanges.subscribe((newValue: any) => {
        this.filterCompetencyThemes = this.filterValues(newValue, this.allCompetencyTheme)
      })
    } else if (searchValue === 'subthemeText') {
      this.requestForm.controls['subthemeText'].valueChanges.subscribe((newValue: any) => {
        this.filteredSubTheme = this.filterValues(newValue, this.allCompetencySubtheme)
      })
    } else if (searchValue === 'providerText' || e) {
      this.requestForm.controls['providerText'].valueChanges.subscribe((newValue: any) => {
        this.filteredRequestType = this.filterOrgValues(newValue, this.requestTypeData)
      })
    }

  }

  filterValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

  filterOrgValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.orgName.toLowerCase().includes(searchValue.toLowerCase()))
  }

  getFilterEntity() {
    const filterObj = {
      search: {
        type: 'Competency Area',
      },
      filter: {
        isDetail: true,
      },
    }
    this.homeService.getFilterEntity(filterObj).subscribe((res: any) => {
      this.competencyList = res
    })
  }

  getRequestTypeList() {
    const requestObj = {
      request: {
        filters: {
          isCbp: true,
        },
      },
    }
    this.homeService.getRequestTypeList(requestObj).subscribe(data => {
      this.requestTypeData = data
      this.filteredRequestType = [...this.requestTypeData]
    })
  }

  selectRequestType(item: any) {
   if (item === 'Single') {
     this.isAssignee = true
     this.isBroadCast = false
   } else if (item === 'Broadcast') {
    this.isBroadCast = true
    this.isAssignee = false
   }

  }

  resetCompSubfields() {
    // this.enableCompetencyAdd = false
    // this.allCompetencySubtheme = []
    // this.seletedCompetencyTheme = []
    // this.seletedCompetencySubTheme = []
  }

  openedChange(e: any, searchControl: any) {
    // Set search textbox value as empty while opening selectbox
    this.requestForm.controls[searchControl].patchValue('')
    // Focus to search textbox while clicking on selectbox
    if (e === true) {
      // this.contentForm.value.provider.focus()
    }
  }

  // Method to clear search values from textbox
  clearSearch(event: any, searchControl: any) {
    event.stopPropagation()
    this.requestForm.controls[searchControl].patchValue('')
  }

 // on selection change of competency area and assign value to allCompetencyTheme
  onAreaSelection(option: any) {
    this.allCompetencySubtheme = []
    this.filteredSubTheme = []
    this.allCompetencyTheme = []
    this.resetCompSubfields()
    this.competencyList.forEach((val: any) => {
      if (option.value.name === val.name) {
        this.seletedCompetencyArea = val
        // this.allCompetencyTheme = val.children
        val.children.forEach((item: any) => {
          item.selected = false
          this.allCompetencyTheme.push(item)
          this.filterCompetencyThemes = [...this.allCompetencyTheme]
        })
      }
    })
  }

  // On Selection of Competency theme and assign value to filteredSubTheme
  onThemeSelection(option: any) {
    this.filteredSubTheme = []
    this.allCompetencySubtheme = []
    // this.enableCompetencyAdd = false
    const index = this.seletedCompetencyTheme.findIndex((object: any) => object.name === option.value.name)
    if (index === -1) {
      this.allCompetencyTheme.forEach((val: any) => {
        option.value.forEach((data: any) => {
          if (data.name === val.name) {
          val.selected = true
          this.seletedCompetencyTheme.push(val)
          val.children.forEach((item: any) => {
            item.selected = false
            item.compThemeID = val.id
            this.allCompetencySubtheme.push(item)
            this.filteredSubTheme = [...this.allCompetencySubtheme]
          })
        }
        })
      })
    } else {
      this.seletedCompetencyTheme[index].selected = false

      const id = this.seletedCompetencyTheme[index].id
      this.seletedCompetencyTheme.splice(index, 1)
      if (this.seletedCompetencyTheme.length === 0) {
        this.seletedCompetencySubTheme = []
      }
      this.allCompetencySubtheme = this.allCompetencySubtheme.filter((item: any) => item.compThemeID !== id)
      this.seletedCompetencySubTheme = this.seletedCompetencySubTheme.filter((item: any) => item.compThemeID !== id)
    }
  }

  onSubThemeSelection(event: any) {
   this.subthemeCheckedList = [...event.value]
   this.subthemeCheckedList.forEach((item: any) => {
      item.checked = true
   })

  }

  onThemeRemoved(theme: any) {
    this.allCompetencySubtheme = []
    this.filteredSubTheme = []
    const compThemeControl = this.requestForm.get('compTheme') as FormControl | null
    if (compThemeControl) {
      const themes = compThemeControl.value
      if (themes) {
        const index = themes.indexOf(theme)
        if (index >= 0) {
          themes.splice(index, 1)
          compThemeControl.setValue(themes)
          if (themes.length) {
            themes.forEach((child: any) => {
              child.children.forEach((innerChild: any) => {
                this.allCompetencySubtheme.push(innerChild)
            this.filteredSubTheme = [...this.allCompetencySubtheme]
            // const constSubthemeCont = this.requestForm.get('compSubTheme') as FormControl | null
            // if(constSubthemeCont){
            //   constSubthemeCont.setValue(this.filteredSubTheme);
            // }

              })
            })
          } else {
            this.allCompetencySubtheme = []
            this.filteredSubTheme = []
          }

        }
      }
    }
  }

  onSubThemeRemoved(theme: any) {
    const compSubThemeControl = this.requestForm.get('compSubTheme') as FormControl | null
    if (compSubThemeControl) {
      const themes = compSubThemeControl.value
      if (themes) {
        const index = themes.indexOf(theme)
        if (index >= 0) {
          themes.splice(index, 1)
          compSubThemeControl.setValue(themes)
        }
      }
    }
  }

  onProviderRemoved(provider: any) {
    const compThemeControl = this.requestForm.get('providers') as FormControl | null
    if (compThemeControl) {
      const themes = compThemeControl.value
      if (themes) {
        const index = themes.indexOf(provider)
        if (index >= 0) {
          themes.splice(index, 1)
          compThemeControl.setValue(themes)
        }
      }
    }
  }

  submit() {
    const request = {
      title: this.requestForm.value.TitleName,
      objective: this.requestForm.value.Objective,
      typeOfUser: this.requestForm.value.userType,
      learningMode: this.requestForm.value.learningMode,
      competencies: {
        select_area: 'Functional',
        select_theme: 'Data Science',
        select_sub_theme: 'Basic',
      },
      referenceLink: this.requestForm.value.referenceLink,
      requestType: this.requestForm.value.requestType,
      preferredProvider: [
        {
          providerName: 'Provider 1',
          providerId: '23456',
        },
        {
          providerName: 'Provider 2',
          providerId: '3456789',
        },
      ],
      status: 'Unassigned',
      source: 'MDOID',

    }

    this.homeService.createDemand(request).subscribe(res => {
      this.resData =res

    })

  }

}
