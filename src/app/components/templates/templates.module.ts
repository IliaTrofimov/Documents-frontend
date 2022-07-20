import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FileSaverModule } from 'ngx-filesaver';

import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { TemplateFieldComponent } from './template-view/template-field.component';
import { TemplateTableComponent } from './template-view/template-table.component';
import { TemplatesRoutingModule } from './templates-routing.module';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { NewTemplateDialog } from './templates-list/new-template-dialog.component';
import { TemplatePreviewDialog } from './template-view/template-preview.component';

/** Модуль для  всех компонентов связанных с отображением шаблонов документов */
@NgModule({
  declarations: [
    TemplatesListComponent,
    TemplateViewComponent,
    TemplateFieldComponent,
    TemplateTableComponent,
    NewTemplateDialog,
    TemplatePreviewDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TemplatesRoutingModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    PipesModule,
    SharedItemsModule ,
    FileSaverModule
  ],
  providers: [],
  bootstrap: [],
  exports: [TemplatesListComponent]
})
export class TemplatesModule { }
