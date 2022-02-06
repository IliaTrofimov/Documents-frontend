import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InputField, RestrictionTypes } from '../models/data-models';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'doc-field',
  templateUrl: './document-field.component.html'          
})
export class DocumentFieldComponent implements OnInit {
  @Input() field: InputField = new InputField("");
  @Input() data: string = "";
  @Input() readOnly: boolean = false;
  @Output() changed: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();

  choices: string[] = [];
  error?: string; 
  unvalidated: string = "";

  constructor(private validServ: ValidationService) {}

  ngOnInit(): void {
    if(this.field.restrictionType == 1 || this.field.restrictionType == 2)
      this.choices = this.field.restrictions.split(';');
    this.unvalidated = this.data;
    this.validServ.on(() => this.validate())
  }

  validate(): boolean {
    if (this.unvalidated == "" && this.field.required){
      this.error = "required";
      this.changed.emit();
    }
    else if(this.field.restrictionType == RestrictionTypes.Except && 
      this.choices.includes(this.unvalidated) && this.field.required){
      this.error = "except";
      this.changed.emit();

    }
    else if(this.field.restrictionType == RestrictionTypes.Only && 
      !this.choices.includes(this.unvalidated) && this.field.required){
      this.error = "only";
      this.changed.emit();
    }
    else{
      this.error = undefined;
      this.changed.emit(this.unvalidated);
      return true;
    }
    return false;
  }
}
