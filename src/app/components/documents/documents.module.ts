import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { DocumentsListComponent } from './documents-list/documents-list.component';
import { NewDocumentDialog } from './documents-list/new-document-dialog.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentFieldComponent } from './document-view/document-field.component';
import { DocumentTableComponent } from './document-view/document-table.component';

import { DocumentSignigComponent } from './document-view/document-signing.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedItemsModule } from 'src/app/components/shared-items/shared-items.module';


/** Модуль для  всех компонентов связанных с отображением документов */
@NgModule({
  declarations: [
    DocumentsListComponent,
    DocumentViewComponent,
    DocumentTableComponent,
    DocumentFieldComponent,
    NewDocumentDialog,
    DocumentSignigComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsRoutingModule,
    MatTableModule,
    PipesModule,
    SharedItemsModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [],
  exports: [DocumentsListComponent] 
})
export class DocumentsModule { }
