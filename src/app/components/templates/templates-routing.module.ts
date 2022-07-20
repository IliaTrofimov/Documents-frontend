import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';


const routes: Routes = [
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/:id', component: TemplateViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
