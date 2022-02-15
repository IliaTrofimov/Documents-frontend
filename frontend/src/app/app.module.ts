import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SiteHeaderComponent } from './shared-items/site-header.component';
import { SiteFooterComponent } from './shared-items/site-footer.component';
import { ErrorComponent } from './shared-items/error.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateFieldComponent } from './template-view/template-field.component';
import { TemplateTableComponent } from './template-view/template-table.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentFieldComponent } from './document-view/document-field.component';
import { DocumentTableComponent } from './document-view/document-table.component';

import { DocumentTypePipe } from './pipes/doctype.pipe';
import { RestrictionPipe } from './pipes/restriction.pipe';
import { FieldTypePipe } from './pipes/field-type.pipe';
import { HTMLInputTypePipe } from './pipes/html-input-type.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    TemplatesListComponent,
    TemplateFieldComponent,
    ErrorComponent,
    TemplateViewComponent,
    DocumentsListComponent,
    DocumentViewComponent,
    DocumentTypePipe,
    RestrictionPipe,
    FieldTypePipe,
    HTMLInputTypePipe,
    TemplateTableComponent,
    DocumentTableComponent,
    DocumentFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
