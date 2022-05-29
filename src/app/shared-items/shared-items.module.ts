import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';

import { ErrorComponent } from './error.component';
import { SiteHeaderComponent } from './site-header.component';
import { SiteFooterComponent } from './site-footer.component';
import { LoadingComponent } from './loading.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert.component';
import { CommonModule } from '@angular/common';
import { WrongUrlComponent } from './wrong-url.component';
import { PaginatorComponent } from './paginator.component';



@NgModule({
  declarations: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    AlertComponent,
    WrongUrlComponent,
    PaginatorComponent
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
    AlertComponent,
    PaginatorComponent,
    WrongUrlComponent
  ]
})
export class SharedItemsModule {
}
