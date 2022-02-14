import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputField, RestrictionTypes, InputType } from '../models/template-models';

@Component({
  selector: 'field-template',
  template: `
  <div class="row">
    <div class="col-10">
        <input class="form-control form-control-sm" placeholder="Название поля" [(ngModel)]="field.name"/>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <select class="form-control form-control-sm" [(ngModel)]="field.dataType">
                    <option *ngFor="let d of dataTypes" [ngValue]="d">{{d | fieldtype}}</option>
                </select>
            </div>
            <div class="input-group-prepend">
                <select class="form-control form-control-sm" [(ngModel)]="field.restrictionType">
                    <option *ngFor="let r of restrictionTypes" [ngValue]="r">{{r | restriction}}</option>
                </select>
            </div>
            <input class="form-control form-control-sm" placeholder="Ограничение" [readonly]="field.restrictionType == 0" [(ngModel)]="field.restrictions"/>
        </div>
    </div>
    <div class="col">
        <button class="btn btn-outline-secondary dropdown-toggle btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Действия</button>
        <div class="dropdown-menu">
            <button class="dropdown-item btn-sm" (click)="changeOrder(-1)">Двигать вверх</button>
            <button class="dropdown-item btn-sm" (click)="changeOrder(1)">Двигать вниз</button>
            <button class="dropdown-item btn-sm" (click)="deleteField()">Удалить</button>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="check_{{field.id}}" [(ngModel)]="field.required">
            <label class="form-check-label" for="check_{{field.id}}">
                Обязательное
            </label>
        </div>
    </div>
  </div>
  `
})
export class TemplateFieldComponent {
    @Input() field: InputField = new InputField({name: ""}); 
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