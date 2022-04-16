import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserViewComponent } from './homepage/user-view.component';

import { TemplateTypesComponent } from './template-types.component';
import { UsersComponent } from './users.component';


const routes: Routes = [
  { path: 'home', component: UserViewComponent },
  { path: 'templatetypes', component: TemplateTypesComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DictionariesRoutingModule { }
