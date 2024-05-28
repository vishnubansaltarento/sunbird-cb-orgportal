import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { Router } from '@angular/router'
import { ViewReportDialogComponent } from '../view-report-dialog/view-report-dialog.component'
import { RejectReasonDialogComponent } from '../reject-reason-dialog/reject-reason-dialog.component'

@Component({
  selector: 'ws-app-users-card',
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.scss'],
})
export class UsersCardComponent implements OnInit {
  @Input() user!: any
  @Input() actions: any
  @Input() type?: any
  @Input() contentData?: any
  @Input() approvalType?: any
  @Input() programData: any
  @Input() public photoUrl!: string
  @Input() public name!: string
  @Output() userClick = new EventEmitter()
  @Input() remove: any

  isViewReport = false
  viewReportData = {
    userId: '',
    formId: '',
  }

  constructor(private dialogue: MatDialog, private router: Router) { }

  ngOnInit() {
    this.checkForSurveyLink()
  }

  getUseravatarName() {
    let name = ''
    if (this.user && this.user.userInfo) {
      name = `${this.user.userInfo.first_name}`
    } else {
      name = `${this.user.first_name}`
    }
    return name
  }

  clickApprove() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Are you sure?',
        body: `Please click <strong>Yes</strong> to approve this request.`,
      },
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        const data = {
          action: 'Approve',
          userData: this.user,
        }
        this.userClick.emit(data)
      }
    })
  }

  clickReject() {
    const dialogRef = this.dialogue.open(RejectReasonDialogComponent, {
      width: '950px',
      disableClose: true,
      data: {
        title: 'Please provide the reason for rejecting the user from the batch',
        buttonText: 'Reject',
      },
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        const data = {
          action: 'Reject',
          userData: this.user,
          comment: response.reason,
        }
        this.userClick.emit(data)
      }
    })
  }

  clickRemove() {
    const dialogRef = this.dialogue.open(RejectReasonDialogComponent, {
      width: '950px',
      disableClose: true,
      data: {
        title: 'Please provide the reason for removing the user from the batch',
        buttonText: 'Remove',
      },
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        const data = {
          action: 'Remove',
          userData: this.user,
          comment: response.reason,
        }
        this.userClick.emit(data)
      }
    })
  }

  loadUser(user: any) {
    this.programData.user = user
    const userId = user.user_id || user.wfInfo[0].userId
    // tslint:disable-next-line:max-line-length
    this.router.navigate([`/app/blended-approvals/${this.programData.programID}/batches/${this.programData.batchID}/${userId}`], { state: this.programData })
    // this.router.navigate([`/app/blended-approvals/user-profile/${user.user_id}`], { state: user })
    // Logic to load the users-view component or navigate to its route
    // You can use Angular's Router or any other mechanism to load the component
  }

  checkForSurveyLink() {
    if (this.type === 'newRequest' && this.contentData && this.contentData['wfSurveyLink']) {
      this.isViewReport = true
      const sID = this.contentData.wfSurveyLink.split('surveys/')
      this.viewReportData.formId = sID[1]
      this.viewReportData.userId = (this.user
        && this.user.userInfo && this.user.userInfo.wid) ? this.user.userInfo.wid : ''
    }
  }

  openReportDialog() {
    const dialogRef = this.dialogue.open(ViewReportDialogComponent, {
      data: this.viewReportData,
      autoFocus: false,
      width: '920px',
    })
    dialogRef.afterClosed().subscribe(() => { })
  }

  canDisableRemoveLink() {
    return this.programData.approvalType &&
      this.programData.approvalType === 'oneStepPCApproval'
  }

}
