import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TemplatesService } from '../../services/templates.service';
import { TemplateField } from '../../models/template-field';
import { Template } from 'src/app/models/template';
import { TemplateType } from "src/app/models/template-type";
import { RestrictionTypes } from 'src/app/models/template-enums';
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { TemplateTable } from 'src/app/models/template-table';


@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService, TemplateTypesService]
})
export class TemplateViewComponent implements OnInit {
  template: Template = new Template();
  templateTypes: TemplateType[] = [];
  status?: [boolean, string]; 
  preparedFields: {columns: TemplateField[], table?: TemplateTable}[] = [];
  private vacantId: number = 0;
  private id: number = -1;

  static _restrictionTypes = [
    RestrictionTypes.None,
    RestrictionTypes.Only,
    RestrictionTypes.Except,
    RestrictionTypes.Registry
  ]
  
  get restrictionTypes(){
    return TemplateViewComponent._restrictionTypes;
  }

  constructor(private templateSvc: TemplatesService, private typesSvc: TemplateTypesService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.templateSvc.getTemplate(this.id).subscribe({
      next: data => {
        this.template = data;
        this.preapareData();
      },
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": `Не удалось загрузить шаблон '${this.template.Id}'`, 
          "error": err.error
        }});
      }
    });

    this.typesSvc.getTypes().subscribe({
      next: data =>  this.templateTypes = data,
      error: err => this.router.navigate(['error'], { queryParams: {
        "title": `Не удалось загрузить типы шаблонов`, 
        "error": JSON.stringify(err.error, null, 2)
      }})
    });

  
  }

  preapareData(){
    let isTable = false;
    let tableId = 0;
    let tableColumns: TemplateField[] = [];
    this.preparedFields = [];

    for (let field of this.template.TemplateField){
      if (field.TemplateTableId) {
        if (tableId != 0 && tableId != field.TemplateTableId) {
          this.preparedFields.push({
            columns: tableColumns, 
            table: this.template.TemplateTable.find(table => table.Id == tableId)
          });
          tableColumns = [];
          tableColumns = [];
        }
        isTable = true;
        tableId = field.TemplateTableId;
        tableColumns.push(field);
      }
      else {
        if (isTable) {
          this.preparedFields.push({ 
            columns: tableColumns, table: this.template.TemplateTable.find(table => table.Id == tableId)
          });
          tableColumns = [];
          tableColumns = [];
        }

        this.preparedFields.push({ columns: [field], table: undefined });
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
    this.template.TemplateField.push(new TemplateField(`Поле ${this.vacantId}`, this.vacantId));
    this.vacantId++;
  }

  addTable(){
    this.template.TemplateField.push(new TemplateField(`Столбец ${this.vacantId}`, this.vacantId));
    this.vacantId++;
  }

  deleteField(id: number){
    this.template.TemplateField.splice(id, 1);
  }

  save(){
    this.templateSvc.updateTemplate(this.template).subscribe({
      error: error => this.status =  [true, error.error],
      complete: () => this.status = [true, "Шаблон сохранён"]
    });
  }

  delete(){
    this.templateSvc.deleteTemplate(this.template.Id).subscribe({
      next: (data) =>  this.router.navigate(["/templates"]),
      error: (err) => this.status = err.error
    });
  }
}
