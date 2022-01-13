import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <site-header></site-header>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
    <site-footer></site-footer>
  `,
})
export class AppComponent {
  title = 'mywebsite';
}
