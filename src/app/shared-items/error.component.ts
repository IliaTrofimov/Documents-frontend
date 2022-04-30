import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteError } from '../models/site-error';

@Component({
  selector: 'error',
  template: `
    <h2 *ngIf="error.Status != 200">Не удалось загрузить страницу :(</h2>
    <h4>{{error.Title}}</h4>
    <p>{{error.Message}}</p>
    <hr>
    <b><small class="text-muted">Код: {{error.Status}}</small></b>
  `
})
export class ErrorComponent {
  error: SiteError = new SiteError(200);
  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute){
    this.querySubscription = route.queryParams.subscribe(
      (param: any) => this.error = new SiteError(param['status'])
    );
  }
}