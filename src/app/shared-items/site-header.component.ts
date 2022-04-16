import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { User } from '../models/user';

@Component({
  selector: 'site-header',
  template: `
    <nav class="hidden-print navbar navbar-expand-lg navbar-light bg-light">
      <a class="hidden-print nav-link active noprint" [routerLink]="['/home']">Домой</a>
      <a class="hidden-print nav-link active" [routerLink]="['/templates']">Шаблоны</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/documents']">Документы</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/templatetypes']">Доп. материалы</a>
    </nav>
  `,
})
export class SiteHeaderComponent implements OnInit {
  user?: User;
  apiUrl: string = "";

  constructor(private config: AppConfig){}

  ngOnInit(): void {
    //this.user = this.config.auth();
    this.apiUrl = this.config.apiUrl;
  }

}
