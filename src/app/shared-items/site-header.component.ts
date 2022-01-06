import { Component, Input } from '@angular/core';

@Component({
  selector: 'site-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="nav-link active" href="#">Домой <span class="sr-only">(current)</span></a>
      <a class="nav-link" href="#">Профиль</a>
    </nav>
    <br>
  `,
})
export class SiteHeaderComponent { 
  @Input() title: string = "Документы";
}
