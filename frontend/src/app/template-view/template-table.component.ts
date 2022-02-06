import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputField, TableField, RestrictionTypes } from '../models/data-models';

@Component({
  selector: 'table-template',
  template: `
    <table class="table-sm table-borderless">
        <tr>
            <td><b>Название таблицы: </b></td>
            <td><b>Количество строк: </b></td>
            <td>
                <button class="btn btn-outline-secondary dropdown-toggle btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Действия</button>
                <div class="dropdown-menu">
                    <button class="dropdown-item btn-sm" (click)="changeOrder(-1)">Двигать вверх</button>
                    <button class="dropdown-item btn-sm" (click)="changeOrder(1)">Двигать вниз</button>
                    <button class="dropdown-item btn-sm" (click)="deleteField()">Удалить</button>
                </div>
            </td>
        </tr>
        <tr>
            <td><input class="form-control form-control-sm" placeholder="Название" [(ngModel)]="table.name"/></td>
            <td><input type="number" class="form-control form-control-sm" [(ngModel)]="table.rows"/></td>
        </tr>
    </table>
    <br>
    <button class="btn badge badge-success" (click)="addColumn()"><b>+</b></button>&nbsp;Столбцы таблицы ({{table.columns.length}}):
    <table class="table table-sm table-borderless">
        <tr *ngFor="let c of table.columns; let i = index">
            <field-template [field]="c" (onDelete)="deleteColumn(i)"></field-template>
        </tr>
    </table>   
  `
})
export class TemplateTableComponent{
    @Input() table: TableField = new TableField("", []); 
    @Output() onDelete = new EventEmitter();
    @Output() onChangeOrder = new EventEmitter<number>();

    static _restrictionTypes = [
        RestrictionTypes.None,
        RestrictionTypes.Only,
        RestrictionTypes.Except,
        RestrictionTypes.Registry
    ]
    get restrictionTypes(){
        return TemplateTableComponent._restrictionTypes;
    }

    deleteColumn(columnId: number){
        this.table.columns.splice(columnId, 1);
    }
    
    addColumn(){
        this.table.columns.push(new InputField(""));
    }

    deleteField(){
        this.onDelete.emit();
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}