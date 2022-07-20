import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { HomepageModule } from './components/homepage/homepage.module';
import { DocumentsModule } from './components/documents/documents.module';
import { TemplatesModule } from './components/templates/templates.module';
import { AppRoutingModule } from './app-routing.module';
import { DictionariesModule } from './components/dictionaries/dictionaries.module';
import { SharedItemsModule } from './components/shared-items/shared-items.module';
import { PipesModule } from './pipes/pipes.module';

import { AppConfig } from './configurations/app.config';
import { ServerErrorInterceptor } from './interceptors/server-errors.interceptor';
import { HeadersInterceptor } from './interceptors/headers.interceptor';



export function loadConfig(config: AppConfig) {
  return () => config.load();
}


@NgModule({
  declarations: [
    AppComponent,
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
    MatTableModule,
    BrowserAnimationsModule,
    HomepageModule
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
