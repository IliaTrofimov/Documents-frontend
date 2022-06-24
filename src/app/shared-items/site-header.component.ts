import { Component } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd; margin-bottom: 1em;">
      <a class="nav-link active" [routerLink]="['/home']" routerLinkActive="active">Домой</a>
      <a class="nav-link active" [routerLink]="['/templates']" routerLinkActive="active">Шаблоны</a>
      <a class="nav-link active" [routerLink]="['/documents']" routerLinkActive="active">Документы</a>
      <a class="nav-link active" [routerLink]="['/dictionaries']" routerLinkActive="active">Доп. материалы</a>
    </nav>
  `,
})
export class SiteHeaderComponent {
}
