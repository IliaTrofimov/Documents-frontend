import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading',
  styleUrls: ['styles.css'],
  template: `
    <div class="d-flex justify-content-center loading" *ngIf="status || true">
      <div class="row">
        <div class="col-sm">
          <div class="spinner-border" role="status"></div>
        </div>
        <div class="col-sm">
          Загрузка...
        </div>
      </div>
    </div>
  `
})
export class LoadingComponent {
  @Input() status: boolean = true;
}