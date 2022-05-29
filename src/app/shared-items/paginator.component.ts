import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SiteError, SiteErrorCodes } from '../models/site-error';
import { ErrorService } from '../services/errors.service';

@Component({
  selector: 'page',
  template: `
  <div class="paginator-container">
    <button [disabled]="page == 0" (click)="onClick.emit(-1)" class="badge btn btn-outline-primary btn-sm">
      назад
    </button>
    <span class="text-muted page">
      {{page + 1}} из {{maxPage + 1}}
    </span>
    <button [disabled]="page == maxPage" (click)="onClick.emit(1)" class="badge btn btn-outline-primary btn-sm">
      вперёд
    </button>
  </div>
  `
})
export class PaginatorComponent{
  @Input() page: number = 0;
  @Input() maxPage: number = 1;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
}