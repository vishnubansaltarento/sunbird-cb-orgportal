import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'ws-app-assign-list-popup',
  templateUrl: './assign-list-popup.component.html',
  styleUrls: ['./assign-list-popup.component.scss'],
})
export class AssignListPopupComponent implements OnInit {
  requestForm!: FormGroup
  providers = [
    { orgName: 'Microsoft',
     details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliq.',
      eta: new Date('2024-02-21') },
    { orgName: 'Google',
     details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliq.',
     eta: new Date('2024-02-21') },
    { orgName: 'IBM',
     details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliq.',
      eta: new Date('2024-02-21') },
    { orgName: 'ISB',
     details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliq.',
      eta: new Date('2024-02-21') },
    { orgName: 'CP',
     details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliq.',
      eta: new Date('2024-02-21') },
  ]
  displayedColumns: string[] = ['select', 'providerName', 'details', 'eta']

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      assignee: new FormControl(''),
    })
  }

  assign() {
    const selectedProvider = this.requestForm.value.assignee
    if (selectedProvider) {
      // Implement your assign logic here
    } else {
    }
  }

  cancel() {
    this.requestForm.reset()
    // Implement your cancel logic here
  }

}
