import { Component } from '@angular/core';
import { AlertService } from './services/alert.service';


@Component({
  selector: 'app-root',
  template: `
    <site-header></site-header>
    <div class="container">
      <alert></alert>
      <router-outlet></router-outlet>
    </div>
    <site-footer></site-footer>
  `,
})
export class AppComponent {
  constructor(private alertSvc: AlertService){
  }

  send(){
    this.alertSvc.info("Тест", {id: "root"}); 
  }
}
