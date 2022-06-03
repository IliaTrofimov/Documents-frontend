import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'page',
  styleUrls: ['styles.css'],
  template: `
  <div class="paginator-container" >
    <button [disabled]="page == 0" (click)="onClick.emit(-1)" [class]="cssClassPrev">
      назад
    </button>
    <span class="text-muted page">
      <small>{{page + 1}} из {{maxPage + 1}}</small>
    </span>
    <button [disabled]="page == maxPage" (click)="onClick.emit(1)" [class]="cssClassNext">
      вперёд
    </button>
  </div>
  `
})
export class PaginatorComponent{
  @Input() page: number = 0;
  @Input() maxPage: number = 1;
  @Output() onClick: EventEmitter<number> = new EventEmitter();

  get cssClassNext(){
    return `badge btn btn-outline-${this.page == this.maxPage ? 'secondary' : 'primary'} btn-sm`
  }

  get cssClassPrev(){
    return `badge btn btn-outline-${this.page == 0 ? 'secondary' : 'primary'} btn-sm`
  }
}