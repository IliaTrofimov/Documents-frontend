import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from './dictionaries.component';
import { TemplateTypesComponent } from './template-types/template-types.component';
import { UsersListComponent } from './users/users-list.component';

const routes: Routes = [
  { path: 'dictionaries', component: DictionariesComponent },
  { path: 'dictionaries/templatetypes', component: TemplateTypesComponent },
  { path: 'dictionaries/users', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DictionariesRoutingModule { }
