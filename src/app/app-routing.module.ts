import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from 'src/app/components/shared-items/error.component';
import { UserViewComponent } from 'src/app/components/homepage/user-view.component';
import { WrongUrlComponent } from 'src/app/components/shared-items/wrong-url.component';

import { DocumentsRoutingModule } from 'src/app/components/documents/documents-routing.module';
import { TemplatesRoutingModule } from 'src/app/components/templates/templates-routing.module';
import { DictionariesRoutingModule } from 'src/app/components/dictionaries/dictionaries-routing.module';


const routes: Routes = [
  { path: 'home', component: UserViewComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: WrongUrlComponent },
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
