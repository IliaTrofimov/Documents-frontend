import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TemplatesService } from '../../services/templates.service';
import { TemplateField } from '../../models/template-field';
import { Template } from 'src/app/models/template';
import { TemplateType } from "src/app/models/template-type";
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { TemplateTable } from 'src/app/models/template-table';




@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService, TemplateTypesService]
})
export class TemplateViewComponent implements OnInit {
  Field = TemplateField;
  Table = TemplateTable;

  template: Template = new Template();
  templateTypes: TemplateType[] = [];
  status?: [boolean, string]; 
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
        console.log(`received data: ${JSON.stringify(this.template, null, 2)}`);
      },
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": `Не удалось загрузить шаблон '${this.template.Id}'`, 
          "error": err.error
        }});
      }
    });

    this.typesSvc.getTypes().subscribe({
      next: data => this.templateTypes = data,
      error: err => this.router.navigate(['error'], { queryParams: {
        "title": `Не удалось загрузить типы шаблонов`, 
        "error": JSON.stringify(err.error, null, 2)
      }})
    });
  }


  changeUsage(){
    this.template.Depricated = !this.template.Depricated;
  }

  changeOrder(oldOrder: number, delta: number){
    let newOrder = oldOrder + delta;
    if (newOrder < this.template.TemplateItems.length && newOrder >= 0){
      [this.template.TemplateItems[newOrder], this.template.TemplateItems[oldOrder]] = [this.template.TemplateItems[oldOrder], this.template.TemplateItems[newOrder]];
    }
  }

  addField(){
    let field = new TemplateField(`Поле ${this.vacantId + 1}`, this.vacantId, this.template.Id);
    console.log(JSON.stringify(field, null, 2));
    this.templateSvc.updateField(this.template.Id, field).subscribe({
      next: f => {
        field.Id = f.Id;
        this.template.TemplateItems.push(field);    
        this.status = [true, "Поле сохранено"];
        this.vacantId++;
      },
      error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
    });
  }

  addTable(){
    let table = new TemplateTable(this.template.Id,
      `Таблица ${this.template.TemplateItems.length + 1}`,
      1, this.vacantId);

    this.templateSvc.updateTable(this.template.Id, table).subscribe({
      next: t => {
        table.Id = t.Id;
        let field = new TemplateField(`Столбец 1`, 0, this.template.Id, table.Id);
        this.templateSvc.updateField(this.template.Id, field).subscribe({
          next: f => {
            field.Id = f.Id;
            this.template.TemplateItems.push(field);
            this.template.TemplateItems.push(table);      
            this.status = [true, "Таблица сохранена"];
            this.vacantId++;
          },
          error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
        });
      },
      error: err => this.status = [false, JSON.stringify(err.error, null, 2)],
    })
  }

  deleteItem(id: number, order: number){
    console.log("deleting item")
    
  }

  save(){
    this.templateSvc.updateTemplate(this.template).subscribe({
      error: error => this.status =  [true, JSON.stringify(error.error, null, 2)],
      next: () => {
        this.status = [true, "Шаблон сохранён"];
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
