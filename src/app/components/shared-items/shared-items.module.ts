import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { ErrorComponent } from './error.component';
import { SiteHeaderComponent } from './site-header.component';
import { SiteFooterComponent } from './site-footer.component';
import { LoadingComponent } from './loading.component';
import { AlertComponent } from './alert.component';
import { WrongUrlComponent } from './wrong-url.component';
import { PaginatorComponent } from './paginator.component';
import { DebugComponent } from './debug.component';

import { AppRoutingModule } from 'src/app/app-routing.module';


/** Модуль для всех вспомогательных компонентов */
@NgModule({
  declarations: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    AlertComponent,
    WrongUrlComponent,
    PaginatorComponent,
    DebugComponent
  ],
  imports: [
    AppRoutingModule,
    RouterModule,
    CommonModule,
    ClipboardModule
  ],
  exports: [
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoadingComponent,
    AlertComponent,
    PaginatorComponent,
    WrongUrlComponent,
    DebugComponent
  ]
})
export class SharedItemsModule {
}
