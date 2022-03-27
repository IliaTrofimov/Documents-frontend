import { Component, Input, OnInit } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from '../../models/template-enums'
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { ValidationService } from '../../services/validation.service';


@Component({
  selector: 'doc-field',
  templateUrl: './document-field.component.html'    
})
export class DocumentFieldComponent implements OnInit {
  @Input() template: TemplateField = new TemplateField("", 0);
  @Input() data: DocumentDataItem = new DocumentDataItem();
  @Input() readonly: boolean = false;

  choices: string[] = [];
  error?: string; 

  constructor(private validSvc: ValidationService) {}

  ngOnInit(): void {
    if(this.template.RestrictionType == 1 || this.template.RestrictionType == 2)
      this.choices = this.template.Restriction.split(';');
    this.validSvc.on(() => this.validate())
  }

  validate(): boolean {
    if (this.data?.Value == "" && this.template.Required){
      this.error = "required";
    }
    else if(this.template.RestrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data.Value) && this.template.Required){
      this.error = "except";

    }
    else if(this.template.RestrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data.Value) && this.template.Required){
      this.error = "only";
    }
    else{
      this.error = undefined;
      return true;
    }
    return false;
  }
}
