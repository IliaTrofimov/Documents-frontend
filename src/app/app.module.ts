import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SiteHeaderComponent } from './shared-items/site-header.component';
import { SiteFooterComponent } from './shared-items/site-footer.component';
import { NotFoundComponent } from './shared-items/not-found.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentTypePipe } from './pipes/doctype.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    TemplatesListComponent,
    NotFoundComponent,
    TemplateViewComponent,
    DocumentsListComponent,
    DocumentViewComponent,
    DocumentTypePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
