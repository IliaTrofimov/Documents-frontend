import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from '../app-routing.module';

import { ErrorComponent } from './error.component';
import { SiteHeaderComponent } from './site-header.component';
import { SiteFooterComponent } from './site-footer.component';
import { LoadingComponent } from './loading.component';



@NgModule({
  declarations: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    MatProgressSpinnerModule
  ]
})
export class SharedItemsModule {
}
