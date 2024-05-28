import { SelectionModel } from '@angular/cdk/collections'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../../users/services/users.service'
import { MatSort } from '@angular/material/sort'
import { BlendedApporvalService } from '../../services/blended-approval.service'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'

@Component({
  selector: 'ws-app-nominate-users-dialog',
  templateUrl: './nominate-users-dialog.component.html',
  styleUrls: ['./nominate-users-dialog.component.scss'],

})
export class NominateUsersDialogComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'email']
  searchText = ''
  selection = new SelectionModel(true, [])
  filteredUsers: any = []
  dataSource = new MatTableDataSource<any>()
  displayLoader = false
  learners: any = []
  userscount: any

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  tableColumns = [
    { name: 'name', dispalyName: 'Full name' },
    { name: 'email', dispalyName: 'Email' },
  ]

  constructor(public dialogRef: MatDialogRef<NominateUsersDialogComponent>,
              private usersService: UsersService,
              private dialogue: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any, private bpService: BlendedApporvalService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId: this.data.orgId,
          status: 1,
        },
        limit: 100,
        offset: 0,
      },
    }
    this.getAllUsers(filterObj)
  }

  getAllUsers(filterObj: any) {
    this.displayLoader = true
    this.filteredUsers = []
    this.dataSource = new MatTableDataSource()
    this.learners = this.data.learners.map((u: any) => {
      return u.user_id
    })
    this.usersService.getAllUsers(filterObj).subscribe(data => {
      data.content.map((details: any) => {
        const dept = (details.profileDetails && details.profileDetails.employmentDetails)
          ? details.profileDetails.employmentDetails.departmentName : details.rootOrgName
        if (!this.learners.includes(details.id)) {
          this.filteredUsers.push({
            name: details.firstName,
            email: details.maskedEmail,
            userId: details.id,
            rootOrgId: this.data.orgId,
            actorUserId: details.id,
            state: 'APPROVED',
            serviceName: 'blendedprogram',
            deptName: dept,
            courseId: this.data.courseId, // blended program course ID
            applicationId: this.data.applicationId, // blended program batch ID
            updateFieldValues: [
              { toValue: { name: details.firstName } },
            ],
          })
        }

      })
      this.dataSource = new MatTableDataSource(this.filteredUsers)
      this.displayLoader = false
    })
  }

  searchUsers(filterValue: any) {
    const filterObj = {
      request: {
        query: filterValue.value ? filterValue.value.trim().toLowerCase() : '',
        filters: {
          rootOrgId: this.data.orgId,
          status: 1,
        },
      },
    }
    this.getAllUsers(filterObj)
  }

  async addLearners() {
    await this.getUsersCount()
    const seletedLearner: any = []
    if (this.selection.selected.length > 0) {
      const differenceCount = this.data.totalBatchCount - this.userscount.totalApplied
      if (this.selection.selected.length <= differenceCount) {
        this.selection.selected.map((user: any) => {
          const obj = {
            userId: user.userId,
            rootOrgId: this.data.orgId,
            actorUserId: user.userId,
            state: 'INITIATE',
            serviceName: 'blendedprogram',
            deptName: user.deptName,
            courseId: this.data.courseId, // blended program course ID
            applicationId: this.data.applicationId, // blended program batch ID
            updateFieldValues: user.updateFieldValues,
          }
          seletedLearner.push(obj)
        })
        this.bpService.nominateLearners(seletedLearner).subscribe((_res: any) => {
          let successCount = 0
          let failedCount = 0
          if (_res && _res.length > 0) {
            _res.forEach((ele: any) => {
              if (ele.result.status === 'OK') {
                successCount = successCount + 1
              } else {
                failedCount = failedCount + 1
              }
            })
          }
          if (successCount > 0 || failedCount > 0) {
            this.openSnackbar(`${successCount} learner(s) nominated successfully,
            while ${failedCount} failed to nominate as it is part of the program.`)
          }
          if (successCount === _res.length) {
            this.openSnackbar(`${successCount} learner(s) nominated successfully.`)
          }
          if (failedCount === _res.length) {
            this.openSnackbar(`${failedCount} failed to nominate as it is part of the program.`)
          }
          // if (_res[0] && _res[0].result && _res[0].result.status === 'OK' &&
          //   this.data.wfApprovalType === 'twoStepMDOAndPCApproval') {
          //   this.openSnackbar('Request sent to Program coordinator for approval.')
          // } else if (_res[0] && _res[0].result && _res[0].result.status === 'NOT_ACCEPTABLE') {
          //   this.openSnackbar(`Learner is already a part of another batch. It can't be added here.`)
          // } else {
          //   if (_res[0] && _res[0].result && _res[0].result.status === 'BAD_REQUEST') {
          //     this.openSnackbar(_res[0].result.errmsg)
          //   } else {
          //     this.openSnackbar('User(s) nominated successfully!')
          //   }
          // }
          this.dialogRef.close('done')
        },                                                        (_err: { error: any }) => {
          this.openSnackbar('some thing went wrong, Please try after sometime.')
        })
      } else {
        this.dialogue.open(DialogConfirmComponent, {
          width: '35vw',
          data: {
            title: 'Nomination Limit Exceeded',
            // tslint:disable-next-line
            body: `You can nominate up to <b> ${differenceCount} </b> learners for this batch, based on the current batch enrollment availability.Please review and adjust your nominations accordingly, and then submit.`,
            ok: 'OK',
            cancel: 'hide',
          },
          disableClose: true,
          autoFocus: false,
        })
      }
    }
  }

  closeDiaogBox() {
    this.dialogRef.close('close')
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  async getUsersCount() {
    if (this.data && this.data.applicationId) {
      // const req = {
      //   serviceName: 'blendedprogram',
      //   applicationStatus: '',
      //   applicationIds: [
      //     this.data.applicationId,
      //   ],
      //   limit: 100,
      //   offset: 0,
      // }
      this.userscount = {
        enrolled: 0,
        totalApplied: 0,
        rejected: 0,
      }

      const request = {
        serviceName: ['blendedprogram'],
        applicationStatus: ['SEND_FOR_PC_APPROVAL', 'SEND_FOR_MDO_APPROVAL', 'APPROVED'],
        applicationIds: [this.data.applicationId],
        limit: 100,
        offset: 0,
      }
      const resData: any = await this.bpService.getSerchRequests(request).toPromise().catch(_error => { })
      if (resData && resData.result && resData.result.data && resData.result.data.length > 0) {
        this.userscount.totalApplied = this.userscount.totalApplied + resData.result.data.length
      }
      return this.userscount
      //  this.bpService.fetchBlendedUserCount(req).then(async (res: any) => {
      //   if (res.result && res.result.data) {
      //     const statusToNegate = ['WITHDRAWN', 'REMOVED', 'REJECTED', 'ADMIN_ENROLL_IS_IN_PROGRESS']
      //     await res.result.data.forEach((ele: any) => {
      //       if (!statusToNegate.includes(ele.currentStatus)) {
      //         this.userscount.totalApplied = this.userscount.totalApplied + ele.statusCount
      //       }
      //     })
      //
      //   }
      // })
    }
  }
}
