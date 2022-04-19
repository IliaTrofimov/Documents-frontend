import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RestrictionTypes, InputType } from 'src/app/models/template-enums';
import { TemplatesService } from 'src/app/services/templates.service';
import { TemplateField } from '../../models/template-field';


@Component({
  selector: 'field-template',
  templateUrl: 'template-field.component.html'
})
export class TemplateFieldComponent {
    @Input() field: TemplateField = new TemplateField("", -1); 
    @Input() readonly: boolean = false;
    @Output() onDelete = new EventEmitter();
    @Output() onChangeOrder = new EventEmitter<number>();

    constructor(private templateSvc: TemplatesService) {}

    static _restrictionTypes = [
        RestrictionTypes.None,
        RestrictionTypes.Only,
        RestrictionTypes.Except,
        RestrictionTypes.Registry
    ]

    static _dataTypes = [
        InputType.Text,
        InputType.Date,
        InputType.Number,
        InputType.Registry
    ]

    get restrictionTypes(){
        return TemplateFieldComponent._restrictionTypes;
    }

    get dataTypes(){
        return TemplateFieldComponent._dataTypes;
    }

    deleteField(){
        console.log("deleting field f")
        this.onDelete.emit();
        this.templateSvc.deleteField(this.field.TemplateId, this.field.Id);
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}