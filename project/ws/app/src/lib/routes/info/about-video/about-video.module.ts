import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AboutVideoComponent } from './about-video.component'
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LocaleTranslatorModule, BreadcrumbsOrgModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [AboutVideoComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    RouterModule,
    WidgetResolverModule,
    LocaleTranslatorModule,
    MatButtonModule,
    BreadcrumbsOrgModule,
    MatToolbarModule,
  ],
  exports: [AboutVideoComponent],
})
export class AboutVideoModule { }
