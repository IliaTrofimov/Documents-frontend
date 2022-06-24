import { Component, Input } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd; margin-bottom: 1em;">
      <a class="nav-link {{urlActive}}" [routerLink]="['/home']" routerLinkActive="active">Домой</a>
      <a class="nav-link {{urlActive}}" [routerLink]="['/templates']" routerLinkActive="active">Шаблоны</a>
      <a class="nav-link {{urlActive}}" [routerLink]="['/documents']" routerLinkActive="active">Документы</a>
      <a class="nav-link {{urlActive}}" [routerLink]="['/dictionaries']" routerLinkActive="active">Доп. материалы</a>
    </nav>
  `,
})
export class SiteHeaderComponent {
  @Input() active: boolean = true;
  
  get urlActive(){
    return this.active ? "active" : "disabled"
  }
}
