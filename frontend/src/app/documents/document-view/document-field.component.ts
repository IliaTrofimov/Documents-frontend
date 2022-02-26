import { Component, Input, OnInit } from '@angular/core';
import { InputField } from '../../models/template-row';
import { RestrictionTypes } from '../../models/template-enums'
import { DocumentDataItem } from 'src/app/models/document-data';
import { ValidationService } from '../../services/validation.service';


@Component({
  selector: 'doc-field',
  templateUrl: './document-field.component.html'    
})
export class DocumentFieldComponent implements OnInit {
  @Input() template: InputField = new InputField({name: ""});
  @Input() data: DocumentDataItem = new DocumentDataItem(-1);
  @Input() readonly: boolean = false;

  choices: string[] = [];
  error?: string; 

  constructor(private validSvc: ValidationService) {}

  ngOnInit(): void {
    if(this.template.restrictionType == 1 || this.template.restrictionType == 2)
      this.choices = this.template.restrictions.split(';');
    this.validSvc.on(() => this.validate())
  }

  validate(): boolean {
    if (this.data?.value == "" && this.template.required){
      this.error = "required";
    }
    else if(this.template.restrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data.value) && this.template.required){
      this.error = "except";

    }
    else if(this.template.restrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data?.value) && this.template.required){
      this.error = "only";
    }
    else{
      this.error = undefined;
      return true;
    }
    return false;
  }
}
