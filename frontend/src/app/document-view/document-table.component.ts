import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { RestrictionTypes, TableField } from '../models';
import { DocumentSavingService } from '../services/document-saving.service';

@Component({
  selector: 'doc-table',
  template: `
    <label>{{table.order + 1}}. {{table.name}}</label>
    <table class="table table-bordered table-sm">
      <thead >
        <tr>
          <th *ngFor="let col of table.columns">
            {{col.name}} <span *ngIf="col.required" class="badge badge-pill badge-info">*</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data; let r = index">
          <td *ngFor="let col of row; let c = index; trackBy:trackByFn">
          <input type="{{table.columns[c].dataType | inputtype}}"
            id="c_{{r}}_{{c}}" 
            class="form-control form-control-sm {{error && error[1] == r && error[2] == c ? 'is-invalid' : ''}}"
            (blur)="validate(r, c)"
            [(ngModel)]="data[r][c]">
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="error" class="alert alert-danger">
      <div *ngIf="error[0] == 'required'">Ячейка [{{error[1] + 1}}, {{error[2] + 1}}] обязательна к заполнению!</div>
      <div *ngIf="error[0] == 'except'">
        Ячейка [{{error[1] + 1}}, {{error[2] + 1}}] не может принимать значения из списка: {{choices}}
      </div>
      <div *ngIf="error[0] == 'only'">
        Ячейка [{{error[1] + 1}}, {{error[2] + 1}}] должно принимать значение из списка: {{choices}}
      </div>
    </div>
  `
})
export class DocumentTableComponent implements OnInit{
  @Input() table: TableField = new TableField("", [], 0);
  @Input() data: Array<Array<string>> = [[]];
  @Input() readOnly: boolean = false;
  @Output() changed: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();
  error?: [string, number, number];
  choices: string[] = [];

  constructor(private savingServ: DocumentSavingService) {}
  
  ngOnInit() {
    this.savingServ.onSaving(() => {
      for(let i = 0; i < this.data.length; i++){
        for(let j = 0; j < this.data[i].length; j++){
          this.validate(i, j);
        }
      }
    })
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  
  validate(row: number, col: number){
    let column = this.table.columns[col];

    if(column.restrictionType == 1 || column.restrictionType == 2)
      this.choices = column.restrictions.split(';'); 
    else
      this.choices = [];

    if (this.data[row][col] == "" && column.required){
      this.error = ["required", row, col];
      this.changed.emit();
    }
    else if(column.restrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data[row][col]) && column.required){
      this.error = ["except", row, col];
      this.changed.emit();
    }
    else if(column.restrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data[row][col]) && column.required){
      this.error = ["only", row, col];
      this.changed.emit();
    }
    else{
      this.error = undefined;
      this.changed.emit(this.data[row][col]);
    }
  }
}
