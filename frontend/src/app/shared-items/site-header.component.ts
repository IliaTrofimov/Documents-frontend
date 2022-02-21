import { Component } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light noprint">
      <a class="nav-link active noprint" [routerLink]="['/templates']">Шаблоны</a>
      <a class="nav-link active noprint" [routerLink]="['/documents']">Документы</a>
    </nav>
    <br>
  `,
})
export class SiteHeaderComponent { }
