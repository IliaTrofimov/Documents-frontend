import { Component, Input, OnInit } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from '../../models/template-enums';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { ValidationService } from '../../services/validation.service';
import { TemplateTable } from 'src/app/models/template-table';


@Component({
  selector: 'doc-table',
  templateUrl: "./document-table.component.html"   
})
export class DocumentTableComponent implements OnInit{
  @Input() columns: TemplateField[] = [];
  @Input() table: TemplateTable = new TemplateTable();
  @Input() data: DocumentDataItem[] = [];
  @Input() readonly: boolean = false;
  error?: [string, number, number];
  choices: string[] = [];
  tempString: string = "";

  constructor(private validSvc: ValidationService) {}
  
  ngOnInit() {
    this.validSvc.on(() => {
      let status = true;
      for(let cell of this.data){
        if (cell.FieldId && cell.Row)
          status = status && this.validate(cell.Value, cell.FieldId, cell.Row);
        else 
          return false;
      }
      return status;
    })
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  

  validate(value: string, col: number, row: number): boolean{
    let column = this.columns[col];
    if (!column || row < 0 || row >= this.table.Rows) return false;

    if (column.RestrictionType == 1 || column.RestrictionType == 2)
      this.choices = column.Restriction.split(';'); 
    else
      this.choices = [];

    if (value == "" && column.Required){
      this.error = ["required", row, col];
    }
    else if(column.RestrictionType == RestrictionTypes.Except && 
      this.choices.includes(value) && column.Required){
      this.error = ["except", row, col];
    }
    else if(column.RestrictionType == RestrictionTypes.Only && 
      !this.choices.includes(value) && column.Required){
      this.error = ["only", row, col];
    }
    else{
      this.error = undefined;
      return true;
    }

    return false;
  }
}
