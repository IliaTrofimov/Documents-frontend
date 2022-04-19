import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateViewComponent } from './template-view/template-view.component';
import { TestComponent } from './test-compnent';


const routes: Routes = [
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/:id', component: TemplateViewComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
