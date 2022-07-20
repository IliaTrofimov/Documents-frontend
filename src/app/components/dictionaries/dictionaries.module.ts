import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

import { PositionsComponent } from './positions/positions.component';
import { NewPositionDialog } from './positions/new-position-dialog.component';
import { TemplateTypesComponent } from './template-types/template-types.component';
import { NewTypeDialog } from './template-types/new-type-dialog.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { UsersListComponent } from './users/users-list.component';
import { NewUserDialog } from './users/new-user-dialog.component';
import { DictionariesComponent } from './dictionaries.component';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';


/** Модуль для всех контроллеров со вспомогательными таблицами (список польщователей, должностей, типов) */
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
    PipesModule,
    MatDialogModule,
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
