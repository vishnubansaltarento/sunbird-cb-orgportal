import { NgModule } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { CommonModule } from '@angular/common'
import {
  AvatarPhotoModule,
  BreadcrumbsOrgModule,
  LeftMenuWithoutLogoModule,
  UIORGTableModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card'
import { BatchDetailsComponent } from './components/batch-details/batch-details.component'
import { BatchListComponent } from './components/batch-list/batch-list.component'
import { BlendedHomeComponent } from './components/blended-home/blended-home.component'
import { BlendedApprovalsRoutingModule } from './blended-approvals-routing.module'
import { UsersCardComponent } from './components/users-card/users-card.component'
import { ProfileViewComponent } from './components/profile-view/profile-view.component'
import { PipeEmailModule } from '../pipes/pipe-email/pipe-email.module'
import { PipeOrderByModule } from '../pipes/pipe-order-by/pipe-order-by.module'
import { ProfileCertificateDialogModule } from './components/profile-certificate-dialog/profile-certificate-dialog.module'
import { SessionCardComponent } from './components/session-card/session-card.component'
import { NominateUsersDialogComponent } from './components/nominate-users-dialog/nominate-users-dialog.component'
import { RejectReasonDialogComponent } from './components/reject-reason-dialog/reject-reason-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ViewReportDialogComponent } from './components/view-report-dialog/view-report-dialog.component'
import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'

@NgModule({
  declarations: [BlendedHomeComponent, BatchListComponent, BatchDetailsComponent, UsersCardComponent, ProfileViewComponent,
    SessionCardComponent, NominateUsersDialogComponent, RejectReasonDialogComponent, ViewReportDialogComponent],
  imports: [CommonModule, BlendedApprovalsRoutingModule, BreadcrumbsOrgModule, LeftMenuWithoutLogoModule, WidgetResolverModule,
    MatSidenavModule, MatButtonModule, MatIconModule, HomeModule, RouterModule, UIORGTableModule,
    MatCardModule, AvatarPhotoModule, MatListModule, PipeEmailModule, PipeOrderByModule, ProfileCertificateDialogModule,
    MatBadgeModule, MatTableModule, MatCheckboxModule, MatSortModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatDialogModule, MatInputModule, MicroSurveyModule, MatProgressSpinnerModule],
  exports: [],
  providers: [],
  entryComponents: [NominateUsersDialogComponent, RejectReasonDialogComponent, ViewReportDialogComponent],
})
export class BlendedApprovalsModule { }
