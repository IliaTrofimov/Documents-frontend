import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { TemplateViewComponent } from './templates/template-view/template-view.component';
import { ErrorComponent } from './shared-items/error.component';
import { DocumentsRoutingModule } from './documents/documents-routing.module';

const routes: Routes = [
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/:id', component: TemplateViewComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    DocumentsRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
