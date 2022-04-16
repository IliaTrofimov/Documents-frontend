import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from 'src/app/models/template-enums';
import { TemplateTable } from 'src/app/models/template-table';


@Component({
  selector: 'table-template',
  templateUrl: 'template-table.component.html' 
})
export class TemplateTableComponent implements OnInit{
    @Input() table: TemplateTable = new TemplateTable(); 
    @Input() columns: TemplateField[] = []; 
    @Input() readonly: boolean = false;
    @Output() onDelete = new EventEmitter();
    @Output() onDeleteColumn = new EventEmitter<number>();
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

    ngOnInit() {
        
    }

    deleteColumn(col: TemplateField){
        this.columns.splice(col.Order, 1);
        for (let i = col.Order; i < this.columns.length; i++)
            this.columns[i].Order = i - 1;
        this.onDeleteColumn.emit(col.Id);
    }
    
    addColumn(){
        this.columns.push(new TemplateField(`Столбец ${this.columns.length + 1}`, 
            this.columns.length, this.table.TemplateId, this.table.Id
        ));
    }

    deleteField(){
        this.onDelete.emit();
    }

    setRows(rows: number){
        this.table.Rows = rows;
    }

    onColumnChangeOrder(index: number, delta: number){
        let newOrder = index + delta;
        if (newOrder < this.columns.length - 1 && newOrder >= 0){
            [this.columns[newOrder], this.columns[index]] = [this.columns[index], this.columns[newOrder]];
            this.columns[newOrder].Order = this.columns[index].Order;
            this.columns[index].Order = this.columns[newOrder].Order;
        }
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}