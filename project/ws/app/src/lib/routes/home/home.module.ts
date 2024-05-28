import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeDurationTransformModule, PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { NgxPaginationModule } from 'ngx-pagination'
import { RainDashboardsModule } from '@sunbird-cb/rain-dashboards'

import { ExportAsModule } from 'ngx-export-as'
import { HomeRoutingModule } from './home.rounting.module'
import { AvatarPhotoModule, BreadcrumbsOrgModule, UIORGTableModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { UsersModule } from '../users/users.module'
import { WorkallocationModule } from '../workallocation/workallocation.module'
import { UIAdminTableModule } from '../../head/work-allocation-table/ui-admin-table.module'
import { LeftMenuModule } from '../../head/left-menu/left-menu.module'

import { InitResolver } from './resolvers/init-resolve.service'
import { MdoInfoService } from './services/mdoinfo.service'
import { UploadService } from './services/upload.service'
import { TrainingPlanDashboardService } from './services/training-plan-dashboard.service'
import { UsersService } from '../users/services/users.service'

import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { AboutComponent } from './routes/about/about.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { ApprovalsComponent } from './routes/approvals/approvals.component'
import { WorkallocationComponent } from './routes/workallocation/workallocation.component'
import { WelcomeComponent } from './routes/welcome/welcome.component'
import { MdoinfoComponent } from './routes/mdoinfo/mdoinfo.component'
import { LeadershipComponent } from './routes/leadership/leadership.component'
import { StaffComponent } from './routes/staff/staff.component'
import { BudgetComponent } from './routes/budget/budget.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { LeadershiptableComponent } from './components/leadershiptable/leadershiptable.component'
import { BudgettableComponent } from './components/budgettable/budgettable.component'
import { AdduserpopupComponent } from './components/adduserpopup/adduserpopup.component'
import { StaffdetailspopupComponent } from './components/staffdetailspopup/staffdetailspopup.component'
import { BudgetschemepopupComponent } from './components/budgetschemepopup/budgetschemepopup.component'
import { BudgetproofspopupComponent } from './components/budgetproofspopup/budgetproofspopup.component'
import { AdmintableComponent } from './components/admintable/admintable.component'
import { BlendedApprovalsComponent } from './routes/blended-approvals/blended-approvals.component'
import { ReportsSectionComponent } from './routes/reports-section/reports-section.component'
import { TrainingPlanDashboardComponent } from './routes/training-plan-dashboard/training-plan-dashboard.component'
import { AdminsTableComponent } from './routes/admins-table/admins-table.component'
import { ReportsVideoComponent } from './routes/reports-video/reports-video.component'
import { ProfleApprovalBulkUploadComponent } from './routes/profle-approval-bulk-upload/profle-approval-bulk-upload.component'
import { UserCardComponent } from './components/user-cards/user-card.component'
import { SearchComponent } from './components/search/search.component'
import { FilterComponent } from './components/filter/filter.component'
import { FilterSearchPipeModule } from '../pipes/filter-search/filter-search.module'
import { ApprovalPendingComponent } from './routes/approvals/approval-pending/approval-pending.component'
import { RejectionPopupComponent } from './components/rejection-popup/rejection-popup.component'
import { AllUsersComponent } from './routes/users-view/all-users/all-users.component'
import { BulkUploadComponent } from './routes/users-view/bulk-upload/bulk-upload.component'
import { VerifyOtpComponent } from './routes/users-view/verify-otp/verify-otp.component'
import { FileProgressComponent } from './routes/users-view/file-progress/file-progress.component'
import { UserCreationComponent } from './routes/users-view/user-creation/user-creation.component'
import { SingleUserCreationComponent } from './routes/users-view/single-user-creation/single-user-creation.component'
import { BulkUploadApprovalComponent } from './routes/approvals/bulk-upload/bulk-upload.component'

@NgModule({
  declarations: [
    HomeComponent,
    UsersViewComponent,
    AboutComponent,
    RolesAccessComponent,
    ApprovalsComponent,
    WorkallocationComponent,
    WelcomeComponent,
    MdoinfoComponent,
    LeadershipComponent,
    StaffComponent,
    BudgetComponent,
    LeftMenuComponent,
    LeadershiptableComponent,
    AdmintableComponent,
    BudgettableComponent,
    AdduserpopupComponent,
    StaffdetailspopupComponent,
    BudgetschemepopupComponent,
    BudgetproofspopupComponent,
    BlendedApprovalsComponent,
    ReportsSectionComponent,
    TrainingPlanDashboardComponent,
    AdminsTableComponent,
    ReportsVideoComponent,
    ProfleApprovalBulkUploadComponent,
    UserCardComponent,
    SearchComponent,
    FilterComponent,
    ApprovalPendingComponent,
    BulkUploadComponent,
    RejectionPopupComponent,
    AllUsersComponent,
    VerifyOtpComponent,
    FileProgressComponent,
    UserCreationComponent,
    SingleUserCreationComponent,
    BulkUploadApprovalComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    UIORGTableModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    FormsModule,
    RouterModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    PipeOrderByModule,
    BreadcrumbsOrgModule,
    WidgetResolverModule,
    ScrollspyLeftMenuModule,
    MatRadioModule,
    ExportAsModule,
    WorkallocationModule,
    NgxPaginationModule,
    UIAdminTableModule,
    RainDashboardsModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    UsersModule,
    MatDatepickerModule,
    PipeDurationTransformModule,
    LeftMenuModule,
    FilterSearchPipeModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
  ],
  entryComponents: [
    AdduserpopupComponent,
    StaffdetailspopupComponent,
    BudgetschemepopupComponent,
    BudgetproofspopupComponent,
    ReportsVideoComponent,
    UserCardComponent,
    SearchComponent,
    FilterComponent,
    RejectionPopupComponent,
    VerifyOtpComponent,
    FileProgressComponent,
  ],
  providers: [
    InitResolver,
    MdoInfoService,
    UploadService,
    TrainingPlanDashboardService,
    UsersService,
  ],
})
export class HomeModule {

}
