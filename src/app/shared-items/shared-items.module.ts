import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';

import { ErrorComponent } from './error.component';
import { SiteHeaderComponent } from './site-header.component';
import { SiteFooterComponent } from './site-footer.component';
import { LoadingComponent } from './loading.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    AlertComponent
  ],
  imports: [
    AppRoutingModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    AlertComponent
  ]
})
export class SharedItemsModule {
}
