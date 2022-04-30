import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { TemplateFieldComponent } from './template-view/template-field.component';
import { TemplateTableComponent } from './template-view/template-table.component';
import { TemplatesRoutingModule } from './templates-routing.module';

import { TestComponent } from './test-compnent';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  declarations: [
    TemplatesListComponent,
    TemplateViewComponent,
    TemplateFieldComponent,
    TemplateTableComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TemplatesRoutingModule,
    MatTableModule,
    MatSnackBarModule,
    PipesModule
  ],
  providers: [],
  bootstrap: [],
  exports: [TemplatesListComponent]
})
export class TemplatesModule { }