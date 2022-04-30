import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TemplateTypesComponent } from './template-types/template-types.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { UsersListComponent } from './users/users-list.component';
import { DictionariesComponent } from './dictionaries.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '../pipes/pipes.module';
import { NewUserDialog } from './users/new-users-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';


@NgModule({
  declarations: [
    TemplateTypesComponent,
    UsersListComponent,
    DictionariesComponent,
    NewUserDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DictionariesRoutingModule,
    MatTableModule,
    MatSnackBarModule,
    PipesModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: []
})
export class DictionariesModule { }
