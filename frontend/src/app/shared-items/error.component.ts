import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'error',
  template: `
    <h2>Не удалось загрузить страницу :(</h2>
    <h3>{{title}}</h3>
    <p>{{error}}</p>
  `
})
export class ErrorComponent {
  title?: number;
  error?: string;

  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute){
    this.querySubscription = route.queryParams.subscribe(
      (param: any) => {
        this.title = param['title'];
        this.error = param['error'];
      }
    );
  }
}