import { Component, OnInit } from '@angular/core';
import { SiteError, SiteErrorCodes } from '../models/site-error';
import { ErrorService } from '../services/errors.service';

@Component({
  selector: 'error',
  template: `
    <h2 *ngIf="error.Status != Codes.Ok">Не удалось загрузить страницу :(</h2>
    <h4>{{error.Title}}</h4>
    <b><small class="text-muted">Код: {{error.Status}}</small></b>
    <hr>
    <p>{{error.Message}}</p>
    <div *ngIf="error.Info" style="width: 80%;">
      <a (click)="hidden = !hidden" class="link">
        {{hidden ? "Подробности..." : "Скрыть"}}
      </a>
      <div class="card" *ngIf="!hidden">
        <pre style="font-family: consolas; font-size: 10pt;">Error: {{error.Info}} </pre>
      </div>
    </div>
  `
})
export class ErrorComponent implements OnInit {
  Codes = SiteErrorCodes;
  hidden: boolean = true;
  error: SiteError = SiteError.Ok;

  constructor(private errorSvc: ErrorService){}

  ngOnInit(){
    this.error = this.errorSvc.lastError;   
  }
}