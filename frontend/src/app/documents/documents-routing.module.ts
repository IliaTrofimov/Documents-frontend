import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrintformComponent } from './printform/printform.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';


const routes: Routes = [
  { path: 'documents', component: DocumentsListComponent },
  { path: 'documents/:id/print', component: PrintformComponent },
  { path: 'documents/:id', component: DocumentViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
