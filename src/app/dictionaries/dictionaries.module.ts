import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { TemplateTypesComponent } from './template-types.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { UsersComponent } from './users.component';
import { UserViewComponent } from './homepage/user-view.component';
import { DocumentsModule } from '../documents/documents.module';
import { TemplatesModule } from '../templates/templates.module';


@NgModule({
  declarations: [
    TemplateTypesComponent,
    UsersComponent,
    UserViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DictionariesRoutingModule,
    MatTableModule,
    DocumentsModule,
    TemplatesModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: []
})
export class DictionariesModule { }
