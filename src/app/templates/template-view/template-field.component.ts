import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RestrictionTypes, InputType } from 'src/app/models/template-enums';
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
    @Output() onSave = new EventEmitter();

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


    save(){
        this.onSave.emit();
    }

    delete(){
        this.onDelete.emit();
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}