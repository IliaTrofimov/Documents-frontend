import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from '../../models/template-enums'
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { ValidationService } from '../../services/validation.service';
import { DataValidationErrors } from 'src/app/models/data-validation-errors';


@Component({
  selector: 'doc-field',
  templateUrl: './document-field.component.html'    
})
export class DocumentFieldComponent implements OnInit {
  @Input() template: TemplateField = new TemplateField("", 0);
  @Input() data: DocumentDataItem = new DocumentDataItem();
  @Input() readonly: boolean = false;
  @Output() onValidated: EventEmitter<boolean> = new EventEmitter<boolean>();  

  ValidationErrors = DataValidationErrors;
  choices: string[] = [];
  error: DataValidationErrors = DataValidationErrors.Ok; 

  constructor(private validSvc: ValidationService) {}

  ngOnInit(): void {
    if(this.template.RestrictionType == 1 || this.template.RestrictionType == 2)
      this.choices = this.template.Restriction.split(';');
    this.validSvc.on(() => this.validate())
  }

  validate() {
    if (this.data?.Value == "" && this.template.Required){
      this.error = DataValidationErrors.Required;
    }
    else if(this.template.RestrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data.Value) && this.template.Required){
      this.error = DataValidationErrors.Except;
    }
    else if(this.template.RestrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data.Value) && this.template.Required){
      this.error = DataValidationErrors.Only;
    }
    else{
      this.error = DataValidationErrors.Ok;
      this.onValidated.emit(true);
      return true;
    }
    this.onValidated.emit(false);
    return false;
  }

  errorMsg(){
    switch(this.error){
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
