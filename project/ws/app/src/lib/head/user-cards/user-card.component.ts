import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
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

  updateUserDataForm: FormGroup
  designationsMeta: any = []

  constructor() {
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', []),
      group: new FormControl('', []),
    })
  }

  ngOnInit() {
    console.log('userId', this.userId)
    console.log('tableData', this.tableData)
    console.log('usersData', this.usersData)
    console.log('totalRecords', this.totalRecords)
    console.log('tabChangeIndex', this.tabChangeIndex)
  }
}
