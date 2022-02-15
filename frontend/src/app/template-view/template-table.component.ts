import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputField, RestrictionTypes, TableField } from '../models/template-models';

@Component({
  selector: 'table-template',
  templateUrl: 'template-table.component.html' 
})
export class TemplateTableComponent implements OnInit{
    @Input() table: TableField = new TableField({ name: "", columns: [] }); 
    @Input() readonly: boolean = false;
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