import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'site-header',
  template: `
    <nav class="hidden-print navbar navbar-expand-lg navbar-light bg-light">
      <a class="hidden-print nav-link active" [routerLink]="['/templates']">Шаблоны</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/documents']">Документы</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/templatetypes']">Типы шаблонов</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/user']">
        {{user ? user.shortName : 'не авторизован' }}
      </a>
    </nav>
    <br>
  `,
})
export class SiteHeaderComponent implements OnInit{ 
  user?: User;
  constructor(private utilitySvc: UtilityService){ }

  ngOnInit(): void {
    this.user = this.utilitySvc.getCurrentUser()
  }
}
