import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentFieldComponent } from './document-view/document-field.component';
import { DocumentTableComponent } from './document-view/document-table.component';
import { PrintformComponent } from './printform/printform.component';
import { DocumentsRoutingModule } from './documents-routing.module';

import { HTMLInputTypePipe } from '../pipes/html-input-type.pipe';
import { DocumentTypePipe } from '../pipes/doctype.pipe';



@NgModule({
  declarations: [
    DocumentsListComponent,
    DocumentViewComponent,
    DocumentTableComponent,
    DocumentFieldComponent,
    PrintformComponent,
    HTMLInputTypePipe,
    DocumentTypePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsRoutingModule,
  ],
  providers: [],
  bootstrap: []
})
export class DocumentsModule { }
