import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestrictionTypes } from '../../models/template-enums';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { ValidationService } from '../../services/validation.service';
import { TemplateTable } from 'src/app/models/template-table';
import { DataValidationErrors } from 'src/app/models/data-validation-errors';


@Component({
  selector: 'doc-table',
  templateUrl: "./document-table.component.html"   
})
export class DocumentTableComponent implements OnInit{
  @Input() table: TemplateTable = new TemplateTable();
  @Input() data: DocumentDataItem[] = [];
  @Input() readonly: boolean = false;
  @Output() onValidated: EventEmitter<boolean> = new EventEmitter<boolean>();

  ValidationErrors = DataValidationErrors;
  preparedData: DocumentDataItem[][] = [];
  error: {error: DataValidationErrors, row: number, col: number} =  {error: DataValidationErrors.Ok, row: -1, col: -1};
  choices: string[] = [];
  tempString: string = "";

  constructor(private validSvc: ValidationService) {}
  
  ngOnInit() {
    console.log("table:", this.data)
    for (let col of this.table.TemplateFields)
      this.preparedData.push(
        this.data.filter(item => item.FieldId == col.Id).sort((a, b) => <number>a.Row - <number>b.Row)
      );
    console.log("prepared:", this.preparedData)

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


  validate(value: string, row: number, col: number): boolean{
    let column = this.table.TemplateFields[col];
    if (!column || row < 0 || row >= this.table.Rows) return false;

    if (column.RestrictionType == 1 || column.RestrictionType == 2)
      this.choices = column.Restriction.split(';'); 
    else
      this.choices = [];

    if (value == "" && column.Required){
      this.error = {error: DataValidationErrors.Required, row: row, col: col};
    }
    else if(column.RestrictionType == RestrictionTypes.Except && 
      this.choices.includes(value) && column.Required){
      this.error = {error: DataValidationErrors.Except, row: row, col: col};
    }
    else if(column.RestrictionType == RestrictionTypes.Only && 
      !this.choices.includes(value) && column.Required){
      this.error = {error: DataValidationErrors.Only, row: row, col: col};
    }
    else{
      this.error = {error: DataValidationErrors.Ok, row: -1, col: -1};
      this.onValidated.emit(true);
      return true;
    }
    this.onValidated.emit(false);
    return false;
  }

  errorMsg(){
    switch(this.error.error){
      case DataValidationErrors.Ok: 
        return "";
      case DataValidationErrors.Except: 
        return "Поле не может принимать следующие значения: " + this.choices.join(', ');
      case DataValidationErrors.Only: 
        return "Поле может принимать только следующие значения: " + this.choices.join(', ');
      case DataValidationErrors.Required: 
        return "Обязательное поле";
    }
  }
}
