import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { ErrorComponent } from './shared-items/error.component';
import { SiteHeaderComponent } from './shared-items/site-header.component';
import { SiteFooterComponent } from './shared-items/site-footer.component';

import { DocumentsModule } from './documents/documents.module';
import { TemplatesModule } from './templates/templates.module';
import { UserViewComponent } from './homepage/user-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';

import { AppConfig } from './app.config';
import { GlobalErrorHandler } from './error-handler';
import { ServerErrorInterceptor } from './interceptors/server-errors.interceptor';
import { HeadersInterceptor } from './interceptors/headers.interceptor';


export function loadConfig(config: AppConfig) {
  return () => config.load();
}


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    UserViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DocumentsModule,
    TemplatesModule,
    DictionariesModule,
    MatTabsModule,
    MatTableModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AppConfig,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfig],  multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
