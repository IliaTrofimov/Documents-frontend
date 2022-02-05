import { Component, Input, Output, EventEmitter, OnInit, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { InputField, RestrictionTypes } from '../models';
import { DocumentSavingService } from '../services/document-saving.service';

@Component({
  selector: 'doc-field',
  template: `
  <div class="form-group">
    <label for="f_{{field.order}}">
      {{field.order + 1}}. {{field.name}} <span *ngIf="field.required" class="badge badge-pill badge-info">*</span>
    </label>
    <textarea *ngIf="field.dataType == 0"
      id="f_{{field.order}}" 
      class="form-control {{error ? 'is-invalid' : ''}}"
      (blur)="validate()"
      [(ngModel)]="unvalidated">
    </textarea>
    <input *ngIf="field.dataType != 0"
      type="{{field.dataType | inputtype}}"
      id="f_{{field.order}}" 
      class="form-control {{error ? 'is-invalid' : ''}}"
      (blur)="validate()"
      [(ngModel)]="unvalidated">
    <div *ngIf="error" class="alert alert-danger">
      <div *ngIf="error == 'required'">Обязательное поле!</div>
      <div *ngIf="error == 'except'">
        Поле не может принимать значения из списка: {{choices}}
      </div>
      <div *ngIf="error == 'only'">
        Поле должно принимать значение из списка:  {{choices}}
      </div>
    </div>
  </div>                    
  `
})
export class DocumentFieldComponent implements OnInit {
  @Input() field: InputField = new InputField("");
  @Input() data: string = "";
  @Input() readOnly: boolean = false;
  @Output() changed: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();

  choices: string[] = [];
  error?: string; 
  unvalidated: string = "";

  constructor(private savingServ: DocumentSavingService) {}

  ngOnInit(): void {
    if(this.field.restrictionType == 1 || this.field.restrictionType == 2)
      this.choices = this.field.restrictions.split(';');
    this.unvalidated = this.data;
    this.savingServ.onSaving(() => this.validate());
  }

  validate() {
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
    }
  }
}
