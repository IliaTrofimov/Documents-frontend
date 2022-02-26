import { Component } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="hidden-print navbar navbar-expand-lg navbar-light bg-light">
      <a class="hidden-print nav-link active" [routerLink]="['/templates']">Шаблоны</a>
      <a class="hidden-print nav-link active noprint" [routerLink]="['/documents']">Документы</a>
    </nav>
    <br>
  `,
})
export class SiteHeaderComponent { }
