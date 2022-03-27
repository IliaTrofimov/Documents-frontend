import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'error',
  template: `
    <h2>Не удалось загрузить страницу :(</h2>
    <h4>{{title}}</h4>
    <p>{{error}}</p>
  `
})
export class ErrorComponent {
  title?: string;
  error?: string;

  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute){
    this.querySubscription = route.queryParams.subscribe(
      (param: any) => {
        this.title = param['title'];
        this.error = param['error'] ? param['error'] : "Такой страницы не существует";
      }
    );
  }
}