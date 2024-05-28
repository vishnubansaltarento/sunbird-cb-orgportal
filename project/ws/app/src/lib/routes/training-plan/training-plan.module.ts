import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule } from '@sunbird-cb/utils'
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
import { MatTabsModule } from '@angular/material/tabs';
import { PipePublicURLModule } from '../pipes/pipe-public-URL/pipe-public-URL.module'
import { PipeDurationTransformModule } from '../pipes/pipe-duration-transform/pipe-duration-transform.module'
import { DefaultThumbnailModule } from '../directives/default-thumbnail/default-thubnail.module'
import { FilterSearchPipeModule } from '../pipes/filter-search/filter-search.module'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { InitResolver } from './resolvers/init-resolve.service'
import { RouterModule } from '@angular/router'
import { AvatarPhotoModule, BreadcrumbsOrgModule, LeftMenuModule, UIORGTableModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ExportAsModule } from 'ngx-export-as'
import { WorkallocationModule } from '../workallocation/workallocation.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { UIAdminTableModule } from '../../head/work-allocation-table/ui-admin-table.module'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { TrainingPlanRoutingModule } from './training-plan.routing.module'
import { TrainingPlanHomeComponent } from './routes/training-plan-home/training-plan-home.component'
import { CreatePlanComponent } from './routes/create-plan/create-plan.component'
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'
import { StepperComponent } from './components/stepper/stepper.component'
import { SearchComponent } from './components/search/search.component'
import { StandardCardComponent } from './components/standard-card/standard-card.component'
import { CompetencySummaryComponent } from './components/competency-summary/competency-summary.component'
import { ChipComponent } from './components/chip/chip.component'
import { CreateAssigneeComponent } from './routes/create-assignee/create-assignee.component'
import { UserCardComponent } from './components/user-card/user-card.component'
import { CreateTimelineComponent } from './routes/create-timeline/create-timeline.component'
import { AddTimelineFormComponent } from './components/add-timeline-form/add-timeline-form.component'
import { FilterComponent } from './components/filter/filter.component'
import { PreviewPlanComponent } from './routes/preview-plan/preview-plan.component'
import { CreateContentComponent } from './routes/create-content/create-content.component'
import { CategoryDropDownComponent } from './components/category-drop-down/category-drop-down.component'
import { AddPlanInformationComponent } from './components/add-plan-information/add-plan-information.component'

import { TrainingPlanService } from './services/traininig-plan.service'
import { UpdatePlanResolveService } from './resolvers/update-plan-resolve.service'
import { ResetDataSharingResolveService } from './resolvers/reset-data-sharing-resolve.service'
import { PreviewDialogBoxComponent } from './components/preview-dialog-box/preview-dialog-box.component'
import { AddContentDialogComponent } from './components/add-content-dialog/add-content-dialog.component'
import { PipeAcsendingOrderModule } from '../pipes/pipe-ascendingorder/pipe-ascendingorder.module'
@NgModule({
  declarations: [
    TrainingPlanHomeComponent,
    CreatePlanComponent,
    BreadcrumbComponent,
    StepperComponent,
    SearchComponent,
    StandardCardComponent,
    CompetencySummaryComponent,
    ChipComponent,
    CreateAssigneeComponent,
    UserCardComponent,
    CreateTimelineComponent,
    AddTimelineFormComponent,
    FilterComponent,
    PreviewPlanComponent,
    CreateContentComponent,
    CategoryDropDownComponent,
    AddPlanInformationComponent,
    PreviewDialogBoxComponent,
    AddContentDialogComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    UIORGTableModule,
    WidgetResolverModule,
    TrainingPlanRoutingModule,
    LeftMenuModule,
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
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatDatepickerModule,
    PipePublicURLModule,
    PipeDurationTransformModule,
    DefaultThumbnailModule,
    FilterSearchPipeModule,
    MatAutocompleteModule,
    PipeAcsendingOrderModule,
  ],
  entryComponents: [
    PreviewDialogBoxComponent,
    AddContentDialogComponent,
  ],
  providers: [
    InitResolver,
    TrainingPlanService,
    UpdatePlanResolveService,
    ResetDataSharingResolveService,
  ],
})
export class TrainingPlanModule {

}
