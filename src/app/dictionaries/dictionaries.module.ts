import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { TemplateTypesComponent } from './template-types.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { UsersComponent } from './users.component';


@NgModule({
  declarations: [
    TemplateTypesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DictionariesRoutingModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: []
})
export class DictionariesModule { }
