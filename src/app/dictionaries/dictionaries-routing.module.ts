import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplateTypesComponent } from './template-types.component';
import { UsersComponent } from './users.component';


const routes: Routes = [
  { path: 'templatetypes', component: TemplateTypesComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DictionariesRoutingModule { }
