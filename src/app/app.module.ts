import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteHeaderComponent } from './shared-items/site-header.component';
import { SiteFooterComponent } from './shared-items/site-footer.component';
import { NotFoundComponent } from './shared-items/not-found.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TemplateViewComponent } from './template-view/template-view.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    TemplatesListComponent,
    NotFoundComponent,
    TemplateViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
