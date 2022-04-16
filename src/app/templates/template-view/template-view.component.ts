import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TemplatesService } from '../../services/templates.service';
import { TemplateField } from '../../models/template-field';
import { Template } from 'src/app/models/template';
import { TemplateType } from "src/app/models/template-type";
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { TemplateTable } from 'src/app/models/template-table';


class DataPair{
  constructor(public columns: TemplateField[], public table?: TemplateTable) {}

  public set order(order: number){
    if (this.table) this.table.Order = order;
    else this.columns[0].Order = order;
  }

  public get order(){
    if (this.table) return this.table.Order;
    else return this.columns[0].Order; 
  }

  public get isTable(){
    return this.table != undefined;
  }

  public get id(){
    if (this.table) return this.table.Id;
    else return this.columns[0].Id; 
  }
}


@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService, TemplateTypesService]
})
export class TemplateViewComponent implements OnInit {
  template: Template = new Template();
  templateTypes: TemplateType[] = [];
  status?: [boolean, string]; 
  preparedFields: DataPair[] = [];
  private vacantId: number = 0;
  private id: number = -1;

  constructor(private templateSvc: TemplatesService, private typesSvc: TemplateTypesService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.templateSvc.getTemplate(this.id).subscribe({
      next: data => {
        this.template = data;
        this.prepareData();
        console.log(JSON.stringify(this.template, null, 2));
      },
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": `Не удалось загрузить шаблон '${this.template.Id}'`, 
          "error": err.error
        }});
      }
    });

    this.typesSvc.getTypes().subscribe({
      next: data =>  {this.templateTypes = data; console.log(JSON.stringify(this.templateTypes, null, 2));},
      error: err => this.router.navigate(['error'], { queryParams: {
        "title": `Не удалось загрузить типы шаблонов`, 
        "error": JSON.stringify(err.error, null, 2)
      }})
    });
  }

  prepareData(){
    let isTable = false;
    let tableId = 0;
    let tableColumns: TemplateField[] = [];
    this.preparedFields = [];

    for (let field of this.template.TemplateField){
      if (field.TemplateTableId) {
        if (tableId != 0 && tableId != field.TemplateTableId) {
          this.preparedFields.push(new DataPair(
            tableColumns, this.template.TemplateTable.find(table => table.Id == tableId)
          ));
          tableColumns = [];
          tableColumns = [];
        }
        isTable = true;
        tableId = field.TemplateTableId;
        tableColumns.push(field);
      }
      else {
        if (isTable) {
          this.preparedFields.push(new DataPair(
            tableColumns, this.template.TemplateTable.find(table => table.Order == tableId)
          ));
          tableColumns = [];
          tableColumns = [];
        }

        this.preparedFields.push(new DataPair([field]));
      }
    }
  }
  
  changeUsage(){
    this.template.Depricated = !this.template.Depricated;
  }

  changeOrder(oldOrder: number, delta: number){
    let newOrder = oldOrder + delta;
    if (newOrder < this.template.TemplateField.length && newOrder >= 0){
      [this.template.TemplateField[newOrder], this.template.TemplateField[oldOrder]] = [this.template.TemplateField[oldOrder], this.template.TemplateField[newOrder]];
    }
  }

  addField(){
    let field = new TemplateField(`Поле ${this.vacantId + 1}`, this.vacantId, this.template.Id);
    console.log(JSON.stringify(field, null, 2));
    this.templateSvc.updateField(this.template.Id, field).subscribe({
      next: f => {
        field.Id = f.Id;
        this.template.TemplateField.push(field);    
        this.preparedFields.push(new DataPair([field]));
        this.status = [true, "Поле сохранено"];
        this.vacantId++;
      },
      error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
    });
  }

  addTable(){
    let table = new TemplateTable(this.template.Id,
      `Таблица ${this.template.TemplateTable.length + 1}`,
      1, this.vacantId);

    this.templateSvc.updateTable(this.template.Id, table).subscribe({
      next: t => {
        table.Id = t.Id;
        let field = new TemplateField(`Столбец 1`, 0, this.template.Id, table.Id);
        this.templateSvc.updateField(this.template.Id, field).subscribe({
          next: f => {
            field.Id = f.Id;
            this.template.TemplateField.push(field);
            this.template.TemplateTable.push(table);      
            this.preparedFields.push(new DataPair([field], table));
            this.status = [true, "Таблица сохранена"];
            this.vacantId++;
          },
          error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
        });
      },
      error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
    })
  }

  deleteField(pair: DataPair){
    if (pair.table){
      let order = pair.order;
      this.templateSvc.deleteTable(this.template.Id, pair.id).subscribe({
        next: () => {
          this.preparedFields.splice(order, 1);
          this.template.TemplateTable.filter(t => t.Id != pair.id);
          this.template.TemplateField.filter(f => f.TemplateId != pair.id);
          this.vacantId--;
          for (let i = order; i < this.preparedFields.length; i++)
            this.preparedFields[i].order = i - 1;

          this.status = [true, "Таблица удалена"];
        },
        error: err => this.status = [false, JSON.stringify(err.error, null, 2)], 
      })
    }
    else {
      let order = pair.order;
      this.templateSvc.deleteField(this.template.Id, pair.id).subscribe({
        next: () => {
          this.preparedFields.splice(order, 1);
          this.template.TemplateField.filter(f => f.Id != pair.id);
          this.vacantId--;
          for (let i = order; i < this.preparedFields.length; i++)
            this.preparedFields[i].order = i - 1;

          this.status = [true, "Поле удалено"];
        },
        error: err => this.status = [false, JSON.stringify(err.error, null, 2)], 
      })
    }
  }

  deleteColumn(id: number){
    this.templateSvc.deleteField(this.template.Id, id).subscribe({
      next: () => {
        this.preparedFields.filter(t => t.id != id);
        this.template.TemplateField.filter(f => f.Id != id);
        this.status = [true, "Столбец удалён"];
      },
      error: err => this.status = [false, JSON.stringify(err.error, null, 2)], 
    })
  }

  save(){
    this.templateSvc.updateTemplate(this.template).subscribe({
      error: error => this.status =  [true, JSON.stringify(error.error, null, 2)],
      next: () => {
        this.status = [true, "Шаблон сохранён"];
        console.clear();
        console.log("New field:");
        console.log(JSON.stringify(this.template, null, 2));
      }
    });
  }

  delete(){
    this.templateSvc.deleteTemplate(this.template.Id).subscribe({
      next: (data) =>  this.router.navigate(["/templates"]),
      error: (err) => this.status = [true, JSON.stringify(err.error, null, 2)]
    });
  }
}
