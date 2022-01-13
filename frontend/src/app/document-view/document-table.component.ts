import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TableField, DocumentData } from '../models';

@Component({
  selector: 'doc-table',
  template: `
    <table class="table">
      <thead>
        <tr>
          <th *ngFor="let col of template.columns">{{col.name}}<ng-template [ngIf]="col.required">*</ng-template></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data; let r = index">
          <td *ngFor="let col of row; let c = index; trackBy:trackByFn">
            <input class="form-control form-control-sm" 
              [(ngModel)]="data[r][c]" 
              [readOnly]="readOnly"
              [required]="template.columns[c].required"/>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DocumentTableComponent {
  @Input() template: TableField = new TableField("", [], 0);
  @Input() data: string[][] = [[]];
  @Input() readOnly: boolean = false;
  @Output() dataChanged: EventEmitter<string[][]> = new EventEmitter<string[][]>();
  isDataChanged: boolean = false;


  trackByFn(index: any, item: any) {
    return index;
  }

}
