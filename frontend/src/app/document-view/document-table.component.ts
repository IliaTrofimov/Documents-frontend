import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RestrictionTypes, TableField } from '../models/data-models';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'doc-table',
  templateUrl: "./document-table.component.html"
})
export class DocumentTableComponent implements OnInit{
  @Input() table: TableField = new TableField("", [], 0);
  @Input() data: Array<Array<string>> = [[]];
  @Input() readOnly: boolean = false;
  @Output() changed: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();
  error?: [string, number, number];
  choices: string[] = [];

  constructor(private validServ: ValidationService) {}
  
  ngOnInit() {
    this.validServ.on(() => {
      let status = true;
      for(let i = 0; i < this.data.length && status; i++){
        for(let j = 0; j < this.data[i].length && status; j++){
          status = status && this.validate(i, j);
        }
      }
      return status;
    })
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  
  validate(row: number, col: number): boolean{
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
      return true;
    }

    return false;
  }
}
