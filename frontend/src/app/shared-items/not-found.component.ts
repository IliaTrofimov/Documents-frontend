import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'not-found',
  template: `
    <h1>404</h1>
    <h3>Ресурс по данному адресу не существует :(</h3>
    <p *ngIf="requestedId && requestedObject">
      Невозможно найти {{requestedObject ? requestedObject : "объект"}} #{{requestedId}}
    </p>
  `
})
export class NotFoundComponent {
  requestedId?: number;
  requestedObject?: string;

  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute){
    this.querySubscription = route.queryParams.subscribe(
      (param: any) => {
        this.requestedId = param['requestedId'];
        this.requestedObject = param['requestedObject'];
      }
    );
  }
}