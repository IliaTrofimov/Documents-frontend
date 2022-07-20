import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RestrictionTypes, InputType } from 'src/app/models/template-enums';

import { TemplateField } from 'src/app/models/template-field';


/** Встраиваемый компонент для отображения поля в шаблоне 
* @param {TemplateField} field - таблица шаблона
* @param {boolean} readonly - помечает, что поле предназначено только для чтения
* @param onDelete - событие, происходящее при попытки удаления поля пользователем
* @param onChangeOrder - событие, происходящее при попытки перемещения данного элемента пользователем, передаёт изменение позиции
* @param onSave - событие, происходящее при попытки сохранения поля
*/
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

    isValid(){
       

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