import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteError } from '../models/site-error';
import { ErrorService } from '../services/errors.service';

@Component({
  selector: 'error',
  template: `
    <h2 *ngIf="error.Status != 200">Не удалось загрузить страницу :(</h2>
    <h4>{{error.Title}}</h4>
    <p>{{error.Message}}</p>
    <hr>
    <b><small class="text-muted">Код: {{error.Status}}</small></b>
    <div *ngIf="error.Info" style="width: 80%;">
      <a (click)="hidden = !hidden" class="btn btn-outline-primary btn-sm badge" data-toggle="collapse" href="#collapse" role="button" aria-expanded="false" aria-controls="collapseExample">
        {{hidden ? "Подробности" : "Скрыть"}}
      </a>
      <div class="collapse" id="collapse">
        <pre style="font-family: consolas; font-size: 10pt;">
Error: {{error.Info}} 
        </pre>
      </div>
    </div>

  `
})
export class ErrorComponent {
  hidden: boolean = true;
  error: SiteError = new SiteError(200);

  constructor(private route: ActivatedRoute, private errorSvc: ErrorService){
    route.queryParams.subscribe(
      (param: any) => {
        this.error = errorSvc.lastError;   
      }
    );
  }
}