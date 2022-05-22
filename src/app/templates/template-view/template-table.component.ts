import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from 'src/app/models/template-enums';
import { TemplateTable } from 'src/app/models/template-table';


@Component({
  selector: 'table-template',
  templateUrl: 'template-table.component.html' 
})
export class TemplateTableComponent {
    @Input() table: TemplateTable = new TemplateTable(); 
    @Input() columns: TemplateField[] = []; 
    @Input() readonly: boolean = false;
    @Output() onDelete = new EventEmitter<TemplateField|TemplateTable>();
    @Output() onChangeOrder = new EventEmitter<number>(); 
    @Output() onAddColumn = new EventEmitter<TemplateField>(); 
    @Output() onSave = new EventEmitter<TemplateField|TemplateTable>();

    static _restrictionTypes = [
        RestrictionTypes.None,
        RestrictionTypes.Only,
        RestrictionTypes.Except,
        RestrictionTypes.Registry
    ]
    get restrictionTypes(){
        return TemplateTableComponent._restrictionTypes;
    }


    addColumn(){
        let column = new TemplateField("Новый столбец", this.columns.length, this.table.TemplateId, this.table.Id);
        this.columns.push(column);
        this.onAddColumn.emit(column);
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }

    onColumnChangeOrder(index: number, delta: number){
        let newOrder = index + delta;
        if (newOrder < this.columns.length - 1 && newOrder >= 0) {
            [this.columns[newOrder], this.columns[index]] = [this.columns[index], this.columns[newOrder]];
            this.columns[newOrder].Order = this.columns[index].Order;
            this.columns[index].Order = this.columns[newOrder].Order;

            this.onSave.emit(this.columns[newOrder]);
            this.onSave.emit(this.columns[index]);
        }
    }

    save(column?: TemplateField){
        this.onSave.emit(column ? column : this.table);
    }

    deleteColumn(column: TemplateField){
        this.columns.splice(column.Order, 1);
        for (let i = column.Order; i < this.columns.length; i++)
            this.columns[i].Order = i - 1;
        this.onDelete.emit(column);
    }

    delete(){
        this.onDelete.emit(this.table);
    }
}