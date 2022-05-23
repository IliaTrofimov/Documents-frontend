import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'error',
  template: `
    <h2>Страница не существует :(</h2>
    <h4>Проверьте правильность адреса</h4>
    <hr>
    <p>
      Вы пытались перейти по адресу <a [href]="url">{{url}}</a>, но данный адрес не существует или недоступен.<br>
      Если вы уверены в правильности запроса, обратитесь к администратору.
    </p>
  `
})
export class WrongUrlComponent {
  private routeSubscription?: Subscription;
  url?: string;

  constructor(private route: ActivatedRoute){
    this.routeSubscription = route.params.subscribe(params => {
      this.url = '/' + this.route.pathFromRoot.map(r => r.snapshot.url).filter(f => !!f[0]).map(([f]) => f.path).join('/');
    });
  }
}