import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DocumentDataItem } from '../models/document-models';
import { InputField, RestrictionTypes } from '../models/template-models';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'doc-field',
  templateUrl: './document-field.component.html'          
})
export class DocumentFieldComponent implements OnInit {
  @Input() template: InputField = new InputField({name: ""});
  @Input() data: DocumentDataItem = new DocumentDataItem(-1);
  @Input() readonly: boolean = false;
  @Output() changed: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();

  choices: string[] = [];
  error?: string; 

  constructor(private validServ: ValidationService) {}

  ngOnInit(): void {
    if(this.template.restrictionType == 1 || this.template.restrictionType == 2)
      this.choices = this.template.restrictions.split(';');
    this.validServ.on(() => this.validate())
  }

  validate(): boolean {
    if (this.data?.value == "" && this.template.required){
      this.error = "required";
      this.changed.emit();
    }
    else if(this.template.restrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.data.value) && this.template.required){
      this.error = "except";
      this.changed.emit();

    }
    else if(this.template.restrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.data?.value) && this.template.required){
      this.error = "only";
      this.changed.emit();
    }
    else{
      this.error = undefined;
      this.changed.emit(this.data.value);
      return true;
    }
    return false;
  }
}
