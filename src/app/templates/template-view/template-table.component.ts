import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TemplateField } from '../../models/template-field';
import { RestrictionTypes } from 'src/app/models/template-enums';
import { TemplateTable } from 'src/app/models/template-table';
import { TemplatesService } from 'src/app/services/templates.service';


@Component({
  selector: 'table-template',
  templateUrl: 'template-table.component.html' 
})
export class TemplateTableComponent {
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

    constructor(private templateSvc: TemplatesService) {}

    deleteColumn(col: TemplateField){
        this.columns.splice(col.Order, 1);
        for (let i = col.Order; i < this.columns.length; i++)
            this.columns[i].Order = i - 1;
        this.templateSvc.deleteField(this.table.TemplateId, col.Id).subscribe();
    }
    
    addColumn(){
        let column = new TemplateField(`Столбец ${this.columns.length + 1}`, 
            this.columns.length, this.table.TemplateId, this.table.Id
        );
        this.columns.push(column);
        this.templateSvc.updateField(this.table.TemplateId, column).subscribe();
    }

    deleteField(){
        this.templateSvc.deleteTable(this.table.TemplateId, this.table.Id).subscribe();
        //this.onDelete.emit();
    }

    setRows(rows: number){
        this.table.Rows = rows;
        this.templateSvc.updateTable(this.table.TemplateId, this.table).subscribe();
    }

    onColumnChangeOrder(index: number, delta: number){
        let newOrder = index + delta;
        if (newOrder < this.columns.length - 1 && newOrder >= 0) {
            [this.columns[newOrder], this.columns[index]] = [this.columns[index], this.columns[newOrder]];
            this.columns[newOrder].Order = this.columns[index].Order;
            this.columns[index].Order = this.columns[newOrder].Order;
        }
    }

    changeOrder(delta: number){
        this.onChangeOrder.emit(delta);
    }
}