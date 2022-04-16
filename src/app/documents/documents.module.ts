import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentFieldComponent } from './document-view/document-field.component';
import { DocumentTableComponent } from './document-view/document-table.component';
import { DocumentsRoutingModule } from './documents-routing.module';

import { HTMLInputTypePipe } from '../pipes/html-input-type.pipe';
import { DocumentStatusPipe } from '../pipes/document-status.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    DocumentsListComponent,
    DocumentViewComponent,
    DocumentTableComponent,
    DocumentFieldComponent,
    HTMLInputTypePipe,
    DocumentStatusPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsRoutingModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [],
  exports: [DocumentsListComponent] 
})
export class DocumentsModule { }
