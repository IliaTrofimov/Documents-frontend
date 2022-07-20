import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { DocumentsModule } from '../documents/documents.module';
import { TemplatesModule } from '../templates/templates.module';
import { UserViewComponent } from './user-view.component';
import { SignsListComponent } from './signs-list.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedItemsModule } from 'src/app/components/shared-items/shared-items.module';


/** Модуль для  всех компонентов связанных с домашней страницей */
@NgModule({
  declarations: [
    UserViewComponent,
    SignsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    PipesModule,
    SharedItemsModule,
    TemplatesModule,
    DocumentsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [],
})
export class HomepageModule { }
