import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ValidationService } from 'src/app/services/validation.service';
import { RestrictionTypes } from 'src/app/models/template-enums';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { TemplateTable } from 'src/app/models/template-table';
import { DataValidationErrors } from 'src/app/models/data-validation-errors';


/** Встраиваемый компонент для отображения таблицы в документе 
* @param {TemplateTable} table - таблица шаблона, на основе которого строится таблица документа
* @param {DocumentDataItem[]} data - массив данных. Должен быть специальным образом отсортирован, 
  предполагается, что сервер возвращает данные в нужном формате. Всегда линейный массив. 
* @param {boolean} readonly - помечает, что поле предназначено только для чтения
* @param onValidated - событие, происходящее при валидации поля, передаёт true, если валидация прошла успешно
*/
@Component({
  selector: 'doc-table',
  templateUrl: "./document-table.component.html"   ,
  styleUrls: ['../styles.css']
})
export class DocumentTableComponent implements OnInit{
  @Input() table: TemplateTable = new TemplateTable();
  @Input() data: DocumentDataItem[] = [];
  @Input() readonly: boolean = false;
  @Output() onSave: EventEmitter<DocumentDataItem> = new EventEmitter<DocumentDataItem>();

  ValidationErrors = DataValidationErrors;
  preparedData: DocumentDataItem[][] = [];
  error: {error: DataValidationErrors, row: number, col: number} =  {error: DataValidationErrors.Ok, row: -1, col: -1};
  choices: string[] = [];
  tempString: string = "";

  constructor(private validSvc: ValidationService) {}
  
  ngOnInit() {
    for (let col of this.table.TemplateFields)
      this.preparedData.push(
        this.data.filter(item => item.FieldId == col.Id).sort((a, b) => <number>a.Row - <number>b.Row)
      );

    this.validSvc.on(() => {
      let status = true;
      for(let cell of this.data){
        if (cell.FieldId && cell.Row)
          status = status && this.validate(cell.Value, cell.Row, cell.FieldId);
      }
      return status
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }


  validate(value: string, row: number, colId: number): boolean{
    let column = this.table.TemplateFields.find(c => c.Id == colId);
    if (!column || row < 0 || row >= this.table.Rows) {
      return false;
    }

    if (column.RestrictionType == 1 || column.RestrictionType == 2)
      this.choices = column.Restriction.split(';').map(element => element.trim());
    else
      this.choices = [];

    if (!value && column.Required){
      this.error = {error: DataValidationErrors.Required, row: row, col: colId};
    }
    else if(column.RestrictionType == RestrictionTypes.Except && 
      this.choices.includes(value) && column.Required){
      this.error = {error: DataValidationErrors.Except, row: row, col: colId};
    }
    else if(column.RestrictionType == RestrictionTypes.Only && 
      !this.choices.includes(value) && column.Required){
      this.error = {error: DataValidationErrors.Only, row: row, col: colId};
    }
    else{
      this.error = {error: DataValidationErrors.Ok, row: -1, col: -1};
      return true;
    }
    return false;
  }

  save(item: DocumentDataItem){
    this.onSave.emit(item);
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
