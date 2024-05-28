import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line:import-name
import _ from 'lodash'
import { BlendedApporvalService } from '../../services/blended-approval.service'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { EventService } from '@sunbird-cb/utils'
import { NominateUsersDialogComponent } from '../nominate-users-dialog/nominate-users-dialog.component'
import moment from 'moment'
import { NsContent } from '../../../../head/_services/widget-content.model'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
@Component({
  selector: 'ws-app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
})
export class BatchDetailsComponent implements OnInit {
  currentFilter = 'pending'
  approvedUsers: any = []
  programData: any
  programID: any
  batchID: any
  batchData: any
  breadcrumbs: any
  newUsers: any = []
  rejectedUsers: any = []
  approvalStatus: any = []
  linkData: any
  userProfile: any
  sessionDetails: any = []
  clonedNewUsers: any = []
  clonedRejectedUsers: any = []
  clonedApprovedUsers: any = []
  learnerCount = 0
  clonedApprovalStatusUsers: any = []
  userscount: any

  constructor(private router: Router, private activeRouter: ActivatedRoute,
    // tslint:disable-next-line:align
    private bpService: BlendedApporvalService,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar,
    // tslint:disable-next-line:align
    private events: EventService,
    // tslint:disable-next-line:align
    private dialogue: MatDialog) {
    const currentState = this.router.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      this.batchData = currentState.extras.state
    }
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.userProfile = this.activeRouter.parent.snapshot.data.configService.unMappedUser
    }
    this.programID = this.activeRouter.snapshot.params.id
    this.batchID = this.activeRouter.snapshot.params.batchid
    if (this.programID) {
      this.getBPDetails(this.programID)
    }
  }

  ngOnInit() { }

  filter(key: 'pending' | 'approved' | 'rejected' | 'sessions' | 'approvalStatus') {
    this.approvedUsers = []
    this.rejectedUsers = []
    this.newUsers = []
    switch (key) {
      case 'pending':
        this.currentFilter = 'pending'
        this.getNewRequestsList()
        break
      case 'approved':
        this.currentFilter = 'approved'
        this.getLearnersList()
        break
      case 'rejected':
        this.currentFilter = 'rejected'
        this.getRejectedList()
        break
      case 'sessions':
        this.currentFilter = 'sessions'
        this.getSessionDetails()
        break
      case 'approvalStatus':
        this.currentFilter = 'approvalStatus'
        this.getApprovalStatusList()
        break
      default:
        break
    }
    this.raiseTelemetry(this.currentFilter, TelemetryEvents.EnumInteractSubTypes.TAB_CONTENT)
  }

  async getUsersCount() {
    if (this.batchData && this.batchData.batchId) {
      // const req = {
      //   serviceName: 'blendedprogram',
      //   applicationStatus: '',
      //   applicationIds: [
      //     this.batchData.batchId,
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
        applicationIds: [this.batchData.batchId],
        limit: 100,
        offset: 0,
      }
      const resData: any = await this.bpService.getSerchRequests(request).toPromise().catch(_error => { })
      if (resData && resData.result && resData.result.data && resData.result.data.length > 0) {
        this.userscount.totalApplied = this.userscount.totalApplied + resData.result.data.length
      }
      return this.userscount
      // await this.bpService.fetchBlendedUserCount(req).then(async (res: any) => {
      //   if (res.result && res.result.data) {
      //     const statusToNegate = ['WITHDRAWN', 'REMOVED', 'REJECTED']
      //     await res.result.data.forEach((ele: any) => {
      //       if (!statusToNegate.includes(ele.currentStatus)) {
      //         this.userscount.totalApplied = this.userscount.totalApplied + ele.statusCount
      //       }
      //     })
      //     return this.userscount
      //   }
      // })
    }
  }

  getBPDetails(programID: any) {
    this.bpService.getBlendedProgramsDetails(programID).subscribe((res: any) => {
      this.programData = res.result.content
      if (!this.batchData) {
        this.programData.batches.forEach((b: any) => {
          if (b.batchId === this.batchID) {
            this.batchData = b
          }
        })
      }
      if (this.programData && this.batchData) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.name, url: `/app/blended-approvals/${this.programData.identifier}/batches` },
          { title: this.batchData.name, url: 'none' }],
        }
        this.linkData = {
          programName: this.programData.name,
          programID: this.programData.identifier,
          batchName: this.batchData.name,
          batchID: this.batchID,
          approvalType: this.programData.wfApprovalType,
        }
        this.getNewRequestsList()
      }
    })
  }

  getLearnersList() {
    this.bpService.getLearners(this.batchData.batchId, this.userProfile.channel).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.approvedUsers = res
        this.clonedApprovedUsers = res
        // this.learnerCount = res.length
      }
    })
    this.getAllLearner()
  }

  getNewRequestsList() {
    const request = {
      serviceName: 'blendedprogram',
      applicationStatus: 'SEND_FOR_MDO_APPROVAL',
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: this.userProfile.rootOrg.orgName,
    }
    this.bpService.getRequests(request).subscribe((res: any) => {
      if (res) {
        this.newUsers = res.result.data
        this.newUsers.sort((a: any, b: any) => {
          return <any>new Date(a.wfInfo[0].lastUpdatedOn) - <any>new Date(b.wfInfo[0].lastUpdatedOn)
        })
        this.clonedNewUsers = res.result.data
      }
    })
    this.getAllLearner()
  }

  getAllLearner() {
    this.bpService.getLearnersWithoutOrg(this.batchData.batchId).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.learnerCount = res.length
      }
    })
  }

  getRejectedList() {
    const request = {
      serviceName: 'blendedprogram',
      applicationStatus: 'REJECTED',
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: this.userProfile.rootOrg.orgName,
    }
    this.bpService.getRequests(request).subscribe((res: any) => {
      if (res) {
        this.rejectedUsers = res.result.data
        this.clonedRejectedUsers = res.result.data
      }
    })
  }

  getApprovalStatusList() {
    const request = {
      serviceName: ['blendedprogram'],
      applicationStatus: ['SEND_FOR_PC_APPROVAL', 'SEND_FOR_MDO_APPROVAL', 'REJECTED', 'REMOVED'],
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: [this.userProfile.rootOrg.orgName],
    }
    this.bpService.getSerchRequests(request).subscribe((res: any) => {
      if (res) {
        this.approvalStatus = res.result.data
        this.clonedApprovalStatusUsers = res.result.data
        this.getActionType()
      }
    })
  }

  getSessionDetails() {
    this.sessionDetails = this.batchData.batchAttributes.sessionDetails_v2
  }

  onSubmit(event: any) {
    const actionType = event.action.toUpperCase()
    // const reqData = event.userData.wfInfo[0]
    const reqData = _.maxBy(event.userData.wfInfo, (el: any) => {
      return new Date(el.lastUpdatedOn).getTime()
    })
    const request = {
      state: 'SEND_FOR_MDO_APPROVAL',
      action: actionType,
      wfId: reqData.wfId,
      applicationId: reqData.applicationId,
      userId: reqData.userId,
      actorUserId: reqData.actorUUID,
      serviceName: 'blendedprogram',
      rootOrgId: reqData.rootOrg,
      courseId: this.programID,
      deptName: reqData.deptName,
      comment: event.comment,
      updateFieldValues: [
        {
          toValue: {
            name: event.userData.userInfo.first_name,
          },
        },
      ],
    }
    this.bpService.updateBlendedRequests(request).subscribe((_res: any) => {
      if (event.action === 'Approve') {
        this.newUsers = []
        if (this.programData.wfApprovalType) {
          this.openSnackbar(this.requestMesages())
        }
        this.getNewRequestsList()
      } else {
        this.getLearnersList()
        this.openSnackbar('Request is removed successfully.')
        this.filter('rejected')
      }
    },                                                      (error: any) => {
      this.openSnackbar(_.get(error, 'error.params.errmsg') ||
        _.get(error, 'error.result.errmsg') ||
        'Something went wrong, please try again later!')
    })
  }

  requestMesages() {
    if (this.programData.wfApprovalType === NsContent.WFBlendedProgramApprovalTypes.ONE_STEP_MDO ||
      this.programData.wfApprovalType === NsContent.WFBlendedProgramApprovalTypes.TWO_STEP_PC_MDO
    ) {
      return 'Request is approved successfully!'
    }
    if (this.programData.wfApprovalType === NsContent.WFBlendedProgramApprovalTypes.TWO_STEP_MDO_PC) {
      return 'Request is approved successfully! Further needs to be approved by program coordinator.'
    }
    return 'Request is approved successfully!'
  }

  removeUser(event: any) {
    const actionType = event.action.toUpperCase()
    const request = {
      rootOrgId: this.userProfile.rootOrgId,
      userId: event.userData.user_id,
      actorUserId: this.userProfile.userId,
      state: 'APPROVED',
      action: actionType,
      applicationId: this.batchID,
      serviceName: 'blendedprogram',
      courseId: this.programID,
      deptName: event.userData.department,
      comment: event.comment,
      updateFieldValues: [{
        toValue: { name: event.userData.first_name },
      }],
    }
    this.bpService.removeLearner(request).subscribe((_res: any) => {
      this.openSnackbar('Learner is removed successfully!')
      this.filter('approved')
      this.getLearnersList()
      // tslint:disable-next-line:align
    }, (_err: { error: any }) => {
      this.openSnackbar('Something went wrong. Please try after sometime.')
    })
  }

  raiseTelemetry(name: string, subtype: string) {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: subtype,
        id: `${_.camelCase(name)}-tab`,
      },
      {},
    )
  }

  async onNominateUsersClick(name: string) {
    this.raiseTelemetry(name, TelemetryEvents.EnumInteractSubTypes.NOMINATE_BTN)

    const batchSize = Number(this.batchData.batchAttributes.currentBatchSize)
    const twentPercent = Math.floor(batchSize * 20 / 100)
    const totalBatchCount = batchSize + twentPercent
    await this.getUsersCount()
    if (this.userscount.totalApplied < totalBatchCount) {
      const dialogRef = this.dialogue.open(NominateUsersDialogComponent, {
        width: '950px',
        data: {
          totalBatchCount,
          orgId: this.userProfile.rootOrgId,
          courseId: this.programID,
          applicationId: this.batchData.batchId,
          learners: this.approvedUsers,
          wfApprovalType: this.programData.wfApprovalType,
          departmentName: this.userProfile.rootOrg.orgName,
        },
        disableClose: true,
        autoFocus: false,
      })
      dialogRef.afterClosed().subscribe((response: any) => {
        if (response && response === 'done') {
          this.getLearnersList()
        }
      })
    } else {
      const confirmDialog = this.dialogue.open(DialogConfirmComponent, {
        width: '35vw',
        data: {
          title: 'Batch Enrollment Full',
          // tslint:disable-next-line
          body: `This batch has currently reached its maximum enrollment limit. You can't nominate a new learner at this time.`,
          ok: 'OK',
          cancel: 'hide',
        },
        disableClose: true,
        autoFocus: false,
      })
      confirmDialog.afterClosed().subscribe((response: any) => {
        if (response && response === 'done') {
          this.getLearnersList()
        }
      })
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  // loadUsersView(user: any) {
  //   this.router.navigate([`/app/blended-approvals/user-profile/${user.userId}`], { state: user })
  //   // Logic to load the users-view component or navigate to its route
  //   // You can use Angular's Router or any other mechanism to load the component
  // }

  removeLearner(startDate: any) {
    return moment(moment().format('YYYY-MM-DD')).isBefore(moment(startDate))
  }

  allowToNominate() {
    return moment(moment().format('YYYY-MM-DD')).isSameOrBefore(moment(this.batchData.enrollmentEndDate))
  }

  filterNewUsers(searchText: string) {
    if (searchText.length > 0) {
      this.newUsers = this.newUsers.filter((result: any) => {
        if (result.userInfo && result.wfInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
            result.wfInfo[0].deptName.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.newUsers = this.clonedNewUsers
    }
  }

  filterApprovedUsers(searchText: string) {
    if (searchText.length > 0) {
      this.approvedUsers = this.approvedUsers.filter((result: any) => {
        if (result.first_name) {
          return result.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
            result.department.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.approvedUsers = this.clonedApprovedUsers
    }
  }

  filterRejectedUsers(searchText: string) {
    if (searchText.length > 0) {
      this.rejectedUsers = this.rejectedUsers.filter((result: any) => {
        if (result.userInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.rejectedUsers = this.clonedRejectedUsers
    }
  }

  filterApprovalStatusUsers(searchText: string) {
    if (searchText.length > 0) {
      this.approvalStatus = this.clonedApprovalStatusUsers
      this.approvalStatus = this.approvalStatus.filter((result: any) => {
        if (result.userInfo && result.wfInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
            result.wfInfo[0].deptName.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.approvalStatus = this.clonedApprovalStatusUsers
    }
  }

  onSearchLearners(searchText: string) {
    if (this.currentFilter === 'pending') {
      this.filterNewUsers(searchText)
    } else if (this.currentFilter === 'approved') {
      this.filterApprovedUsers(searchText)
    } else if (this.currentFilter === 'rejected') {
      this.filterRejectedUsers(searchText)
    } else if (this.currentFilter === 'approvalStatus') {
      this.filterApprovalStatusUsers(searchText)
    }
  }

  showLearners() {
    if (this.batchData && this.batchData.batchAttributes && this.batchData.batchAttributes.currentBatchSize) {
      return `${this.learnerCount}/${this.batchData.batchAttributes.currentBatchSize}`
    }
    return this.learnerCount
  }

  getActionType() {
    if (this.approvalStatus && this.approvalStatus.length > 0) {
      this.approvalStatus.forEach((element: any) => {
        if (element && element.wfInfo.length > 0) {
          element.wfInfo = _.sortBy(element.wfInfo, ['lastUpdatedOn'])
          let lastModify = (element.wfInfo[element.wfInfo.length - 1].modificationHistory) ?
            JSON.parse(element.wfInfo[element.wfInfo.length - 1].modificationHistory) : []
          if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'REJECTED' && lastModify.length > 0) {
            lastModify = lastModify.filter((v: any) => v.action === 'REJECT')
            element['approvalAction'] = (lastModify[lastModify.length - 1].role === 'MDO_ADMIN') ? 'rejectedByMdo' :
              (lastModify[lastModify.length - 1].role === 'PROGRAM_COORDINATOR') ? 'rejectedByPc' : ''
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'SEND_FOR_MDO_APPROVAL') {
            element['approvalAction'] = 'pendingForMdo'
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'SEND_FOR_PC_APPROVAL') {
            element['approvalAction'] = 'pendingForPc'
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'REMOVED' && lastModify.length > 0) {
            lastModify = lastModify.filter((v: any) => v.action === 'REMOVE')
            element['approvalAction'] = (lastModify[lastModify.length - 1].role === 'MDO_ADMIN') ? 'removeByMdo' :
              (lastModify[lastModify.length - 1].role === 'PROGRAM_COORDINATOR') ? 'removeByPc' : ''
          }
        }
      })
    }
  }
}
