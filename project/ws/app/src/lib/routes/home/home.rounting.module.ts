import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './routes/home/home.component'
import { AboutComponent } from './routes/about/about.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { ApprovalsComponent } from './routes/approvals/approvals.component'
import { WorkallocationComponent } from './routes/workallocation/workallocation.component'
import { LeadershipComponent } from './routes/leadership/leadership.component'
import { StaffComponent } from './routes/staff/staff.component'
import { MdoinfoComponent } from './routes/mdoinfo/mdoinfo.component'
import { BudgetComponent } from './routes/budget/budget.component'
import { BlendedApprovalsComponent } from './routes/blended-approvals/blended-approvals.component'
import { ReportsSectionComponent } from './routes/reports-section/reports-section.component'
import { TrainingPlanDashboardComponent } from './routes/training-plan-dashboard/training-plan-dashboard.component'
import { ApprovalPendingComponent } from './routes/approvals/approval-pending/approval-pending.component'
import { WelcomeComponent } from './routes/welcome/welcome.component'
import { AllUsersComponent } from './routes/users-view/all-users/all-users.component'
import { BulkUploadComponent } from './routes/users-view/bulk-upload/bulk-upload.component'

import { PageResolve } from '@sunbird-cb/utils'
import { HomeResolve } from './resolvers/home-resolve'
import { ConfigResolveService } from './resolvers/config-resolve.service'
import { UsersListResolve } from './resolvers/users-list-resolve.service'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: '',
    component: HomeComponent,
    resolve: {
      configService: ConfigResolveService,
      tabs: HomeResolve,
    },
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        data: {
          pageId: 'welcome',
          module: 'Home',
        },
      },
      {
        path: 'users',
        component: UsersViewComponent,
        resolve: {
          usersList: UsersListResolve,
          pageData: PageResolve,
          configService: ConfigResolveService,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'all-users',
          },
          {
            path: 'all-users',
            component: AllUsersComponent,
            resolve: {
              usersList: UsersListResolve,
              pageData: PageResolve,
              configService: ConfigResolveService,
            },
            data: {
              pageId: 'users',
              module: 'User',
              pageType: 'feature',
              pageKey: 'users-view',
            },
          },
          {
            path: 'all-users/:tab',
            component: AllUsersComponent,
            resolve: {
              usersList: UsersListResolve,
              pageData: PageResolve,
              configService: ConfigResolveService,
            },
            data: {
              pageId: 'users',
              module: 'User',
              pageType: 'feature',
              pageKey: 'users-view',
            },
          },
          {
            path: 'bulk-upload',
            component: BulkUploadComponent,
            resolve: {
              usersList: UsersListResolve,
              pageData: PageResolve,
              configService: ConfigResolveService,
            },
            data: {
              pageId: 'users',
              module: 'User',
              pageType: 'feature',
              pageKey: 'users-view',
            },
          },
        ],
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          pageId: 'about',
          module: 'Home',
        },
      },
      {
        path: 'roles-access',
        component: RolesAccessComponent,
        data: {
          pageId: 'roles-access',
          module: 'Roles',
        },
        resolve: {
          usersList: UsersListResolve,
        },
      },
      {
        path: 'approvals',
        component: ApprovalsComponent,
        data: {
          pageId: 'approvals',
          module: 'Approvals',
          pageType: 'feature',
          pageKey: 'approval-view',
        },
        resolve: {
          pageData: PageResolve,
          configService: ConfigResolveService,
        },
        children: [
          // {
          //   path: '',
          //   pathMatch: 'full',
          //   redirectTo: 'profileverification',
          // },
          {
            path: 'profileverification',
            component: ApprovalPendingComponent,
            data: {
              pageId: 'approvals-profileverification',
              module: 'Approvals',
            },
            resolve: {
              pageData: PageResolve,
              configService: ConfigResolveService,
            },
          },
          {
            path: 'transfers',
            component: ApprovalPendingComponent,
            data: {
              pageId: 'approvals-transfers',
              module: 'Approvals',
              pageType: 'feature',
              pageKey: 'approval-view',
            },
            resolve: {
              pageData: PageResolve,
              configService: ConfigResolveService,
            },
          },
        ],
      },
      {
        path: 'approvals/pending/:tab',
        component: ApprovalsComponent,
        data: {
          pageId: 'approvals',
          module: 'Approvals',
          pageType: 'feature',
          pageKey: 'approval-view',
        },
        resolve: {
          pageData: PageResolve,
          configService: ConfigResolveService,
        },
      },
      {
        path: 'workallocation/:tab',
        data: {
          pageId: 'workallocation',
          module: 'Work Allocation',
        },
        component: WorkallocationComponent,
      },
      {
        path: 'workallocation',
        redirectTo: 'workallocation/draft', pathMatch: 'full',
        data: {
          pageId: 'workallocation',
          module: 'Work Allocation',
        },
        component: WorkallocationComponent,
      },
      {
        path: 'blended-approvals',
        component: BlendedApprovalsComponent,
        data: {
          pageId: 'blended-approvals',
          module: 'Home',
        },
      },
      {
        path: 'reports-section',
        component: ReportsSectionComponent,
        data: {
          pageId: 'reports-section',
          module: 'Home',
        },
      },
      {
        path: 'training-plan-dashboard',
        component: TrainingPlanDashboardComponent,
        data: {
          pageId: 'training-plan-dashboard',
          pageType: 'feature',
          pageKey: 'training-plan-dashboard',
        },
        resolve: {
          configService: ConfigResolveService,
          pageData: PageResolve,
        },
      },
    ],
  },
  {
    path: 'mdoinfo',
    component: MdoinfoComponent,
    data: {
      pageId: 'mdoinfo',
      module: 'Home',
    },
    resolve: {
      configService: ConfigResolveService,
    },
    children: [
      {
        path: 'leadership',
        component: LeadershipComponent,
        data: {
          pageId: 'leadership',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          pageId: 'staff',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'budget',
        component: BudgetComponent,
        data: {
          pageId: 'budget',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    HomeResolve,
    // DepartmentResolve,
    ConfigResolveService,
    UsersListResolve,
  ],
})
export class HomeRoutingModule { }
