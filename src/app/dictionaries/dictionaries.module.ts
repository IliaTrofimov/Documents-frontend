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
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NewTypeDialog } from './template-types/new-type-dialog.component';
import { PositionsComponent } from './positions/positions.component';
import { NewPositionDialog } from './positions/new-position-dialog.component';


@NgModule({
  declarations: [
    TemplateTypesComponent,
    UsersListComponent,
    DictionariesComponent,
    PositionsComponent,
    NewUserDialog,
    NewTypeDialog,
    NewPositionDialog
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
    MatChipsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    SharedItemsModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: []
})
export class DictionariesModule { }
