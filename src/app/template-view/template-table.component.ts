import { Component, EventEmitter , Output, Input } from '@angular/core';
import { InputField, TableField, RestrictionTypes } from '../models';

@Component({
  selector: 'table-template',
  template: `
    <ng-template [ngIf]="editing" [ngIfElse]="viewing_table">
        <table class="table-sm table-borderless">
            <tr>
                <td><b>Название таблицы: </b></td>
                <td><b>Количество строк: </b></td>
            </tr>
            <tr>
                <td><input class="form-control form-control-sm" [(ngModel)]="table.name" (ngModelChange)="onChange()"/></td>
                <td><input type="number" class="form-control form-control-sm" [(ngModel)]="table.rows" (ngModelChange)="onChange()"/></td>
            </tr>
        </table>
        <br>
        <button class="btn badge badge-success" (click)="addTableColumn()"><b>+</b></button>&nbsp;Столбцы таблицы ({{table.columns.length}}):
        <table class="table table-sm table-borderless">
            <tr *ngFor="let c of table.columns; let i = index">
                <td width="200px"><input class="form-control form-control-sm" placeholder="Название" [(ngModel)]="c.name" (ngModelChange)="onChange()"/></td>
                <td><div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <select class="form-control form-control-sm" [(ngModel)]="c.restrictType">
                            <option *ngFor="let r of restrictionTypes" [ngValue]="  r">{{r | restriction}}</option>
                        </select>
                    </div>
                    <input class="form-control form-control-sm" placeholder="Ограничение" [readonly]="c.restrictType == 0" [(ngModel)]="c.restrictions"/>
                </div></td>
                <td width="50px">
                    <button class="btn btn-danger btn-sm" (click)="deleteTableColumn(i)"><b>✕</b></button>
                </td>
            </tr>
        </table>
    </ng-template>
    <ng-template #viewing_table>
        {{table.name}} <span class="badge badge-secondary">таблица</span>
    </ng-template>     
  `
})
export class TemplateTableComponent{
    @Input() table: TableField = new TableField("Новая таблица", []); 
    @Input() editing: boolean = false; 
    @Output() tableChanged = new EventEmitter<TableField>();

    static _restrictionTypes = [
        RestrictionTypes.None,
        RestrictionTypes.Only,
        RestrictionTypes.Except,
        RestrictionTypes.Registry
    ]
    get restrictionTypes(){
        return TemplateTableComponent._restrictionTypes;
    }

    deleteTableColumn(columnId: number){
        this.table.columns.splice(columnId, 1);
        //this.tableChanged.emit(this.table);
    }
    
    addTableColumn(){
        this.table.columns.push(new InputField("Новый столбец"));
        //this.tableChanged.emit(this.table);
    }

    onChange(){
        //this.tableChanged.emit(this.table);
    } 
}