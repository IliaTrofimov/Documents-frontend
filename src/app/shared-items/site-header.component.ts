import { Component } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="nav-link active" [routerLink]="['/templates']">Шаблоны</a>
      <a class="nav-link active" [routerLink]="['/documents']">Документы</a>
    </nav>
    <br>
  `,
})
export class SiteHeaderComponent { }
