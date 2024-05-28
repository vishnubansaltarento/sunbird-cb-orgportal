import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDividerModule } from '@angular/material/divider'
import { MatCardModule } from '@angular/material/card'
import { ProfileDetailComponent } from './profile-detail.component'
import { RouterModule } from '@angular/router'
import { ViewUsersComponent } from './view-users/view-users.component'
import { CardDetailsModule } from '../card-details/card-details.module'
@NgModule({
  declarations: [ProfileDetailComponent, ViewUsersComponent],
  imports: [
    CommonModule,
    CardDetailsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ViewUsersComponent],
  exports: [ProfileDetailComponent],
})

export class ProfileDetailModule { }
