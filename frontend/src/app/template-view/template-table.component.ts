import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputField, RestrictionTypes } from '../models/template-models';
import { TableField } from "../models/template-models";

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
export class TemplateTableComponent implements OnInit{
    @Input() table: TableField = new TableField({ name: "", columns: [] }); 
    @Output() onDelete = new EventEmitter();
    @Output() onChangeOrder = new EventEmitter<number>();
    vacantId: number = 0;

    static _restrictionTypes = [
        RestrictionTypes.None,
        RestrictionTypes.Only,
        RestrictionTypes.Except,
        RestrictionTypes.Registry
    ]
    get restrictionTypes(){
        return TemplateTableComponent._restrictionTypes;
    }

    ngOnInit() {
        for (let f of this.table.columns) {
            if (f.id > this.vacantId) {
                this.vacantId = f.id;
            }
        }
        this.vacantId++;
    }

    deleteColumn(columnId: number){
        this.table.columns.splice(columnId, 1);
    }
    
    addColumn(){
        this.table.columns.push(new InputField({name: "", id: this.vacantId}));
        this.vacantId++;
    }

    deleteField(){
        this.onDelete.emit();
    }

    onColumnChangeOrder(index: number, delta: number){
        let newOrder = index + delta;
        if (newOrder < this.table.columns.length - 1 && newOrder >= 0){
            [this.table.columns[newOrder], this.table.columns[index]] = [this.table.columns[index], this.table.columns[newOrder]];
        }
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}