import { NgModule } from '@angular/core';
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

import { DocumentsModule } from './documents/documents.module';
import { TemplatesModule } from './templates/templates.module';
import { UserViewComponent } from './homepage/user-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { SharedItemsModule } from './shared-items/shared-items.module';

import { AppConfig } from './app.config';
import { ServerErrorInterceptor } from './interceptors/server-errors.interceptor';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { PipesModule } from './pipes/pipes.module';



export function loadConfig(config: AppConfig) {
  return () => config.load();
}


@NgModule({
  declarations: [
    AppComponent,
    UserViewComponent,
  ],
  imports: [
    DocumentsModule,
    TemplatesModule,
    DictionariesModule,
    SharedItemsModule,
    PipesModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfig],  multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
