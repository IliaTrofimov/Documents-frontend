import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './shared-items/error.component';
import { DocumentsRoutingModule } from './documents/documents-routing.module';
import { TemplatesRoutingModule } from './templates/templates-routing.module';
import { DictionariesRoutingModule } from './dictionaries/dictionaries-routing.module';
import { UserViewComponent } from './homepage/user-view.component';


const routes: Routes = [
  { path: 'home', component: UserViewComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    DocumentsRoutingModule,
    TemplatesRoutingModule,
    DictionariesRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
