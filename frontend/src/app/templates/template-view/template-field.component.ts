import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RestrictionTypes, InputType } from 'src/app/models/template-enums';
import { InputField } from '../../models/template-row';


@Component({
  selector: 'field-template',
  templateUrl: 'template-field.component.html'
})
export class TemplateFieldComponent {
    @Input() field: InputField = new InputField({name: ""}); 
    @Input() readonly: boolean = false;
    @Output() onDelete = new EventEmitter();
    @Output() onChangeOrder = new EventEmitter<number>();


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
        this.onDelete.emit();
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}