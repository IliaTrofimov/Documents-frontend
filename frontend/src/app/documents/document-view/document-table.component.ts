import { Component, Input, OnInit } from '@angular/core';
import { TableField } from '../../models/template-row';
import { RestrictionTypes } from '../../models/template-enums';
import { DocumentDataTable } from 'src/app/models/document-data';
import { ValidationService } from '../../services/validation.service';


@Component({
  selector: 'doc-table',
  templateUrl: "./document-table.component.html"   
})
export class DocumentTableComponent implements OnInit{
  @Input() table: TableField = new TableField({ name: "", columns: [], rows: 0 });
  @Input() data: DocumentDataTable = new DocumentDataTable(-1, []);
  @Input() readonly: boolean = false;
  error?: [string, number, number];
  choices: string[] = [];
  tempString: string = "";

  constructor(private validSvc: ValidationService) {}
  
  ngOnInit() {
    this.validSvc.on(() => {
      let status = true;
      for(let i = 0; i < this.data.columns.length; i++){
        for(let j = 0; j < this.data.columns[i].values.length; j++){
          status = status && this.validate(j, i);
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

    if (this.data.columns[col].values[row] == "" && column.required){
      this.error = ["required", row, col];
    }
    else if(column.restrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data.columns[col].values[row]) && column.required){
      this.error = ["except", row, col];
    }
    else if(column.restrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data.columns[col].values[row]) && column.required){
      this.error = ["only", row, col];
    }
    else{
      this.error = undefined;
      return true;
    }

    return false;
  }
}
