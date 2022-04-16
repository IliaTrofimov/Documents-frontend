import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { ErrorComponent } from './shared-items/error.component';
import { SiteHeaderComponent } from './shared-items/site-header.component';
import { SiteFooterComponent } from './shared-items/site-footer.component';

import { DocumentsModule } from './documents/documents.module';
import { TemplatesModule } from './templates/templates.module';
import { AppRoutingModule } from './app-routing.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { AppConfig } from './app.config';




export function loadConfig(config: AppConfig) {
  return () => config.load();
}


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DocumentsModule,
    TemplatesModule,
    DictionariesModule,
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfig],  multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
