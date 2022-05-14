import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TemplatesService } from '../../services/templates.service';
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { Template } from 'src/app/models/template';
import { TemplateType } from "src/app/models/template-type";
import { TemplateField } from '../../models/template-field';
import { TemplateTable } from 'src/app/models/template-table';
import { ITemplateItem } from 'src/app/models/template-item';



@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService, TemplateTypesService]
})
export class TemplateViewComponent implements OnInit {
  Field = TemplateField;
  Table = TemplateTable;

  template: Template = new Template();
  templateTypes?: TemplateType[];
  private vacantId: number = 0;
  private id: number = -1;

  constructor(private templateSvc: TemplatesService, private typesSvc: TemplateTypesService, 
    private route: ActivatedRoute, 
    private router: Router,
    private messageBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.templateSvc.getTemplate(this.id).subscribe({
      next: data => {
        this.template = data;
        this.vacantId = data.TemplateItems.length;
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

  showError(error: any){
    this.messageBar.dismiss();

    this.messageBar.open(`Ошибка!\n${JSON.stringify(error)}`, "Принять", {
      duration: 500        
    }).onAction().subscribe(() => this.messageBar.dismiss()); 

  }

  showInfo(msg: string){
    this.messageBar.dismiss();

    this.messageBar.open(msg, "Принять", {
      duration: 500     
    }).onAction().subscribe(() => this.messageBar.dismiss()); 
  }


  changeUsage(){
    this.template.Depricated = !this.template.Depricated;
    this.save();
  }

  changeOrder(oldOrder: number, delta: number){
    let newOrder = oldOrder + delta;
    if (newOrder < this.template.TemplateItems.length && newOrder >= 0){
      [this.template.TemplateItems[newOrder], this.template.TemplateItems[oldOrder]] = [this.template.TemplateItems[oldOrder], this.template.TemplateItems[newOrder]];
    }
    this.updateItem(this.template.TemplateItems[newOrder]);
    this.updateItem(this.template.TemplateItems[oldOrder]);
  }

  addField(){
    let field = new TemplateField(`Поле ${this.vacantId + 1}`, this.vacantId, this.template.Id);
    this.templateSvc.updateField(this.template.Id, field).subscribe({
      next: f => {
        field.Id = f.Id;
        this.template.TemplateItems.push(field);    
        this.showInfo("Поле сохранено");
        this.vacantId++;
      },
      error: err => this.showError(err.error),
    });
  }

  addColumn(column: TemplateField){
    this.templateSvc.updateField(this.template.Id, column).subscribe({
      next: () =>this.showInfo("Столбец сохранен"),
      error: err => this.showError(err.error),
    });
  }

  addTable(){
    let table = new TemplateTable(this.template.Id,
      `Таблица ${this.template.TemplateItems.length + 1}`,
      1, this.vacantId);
    let field = new TemplateField(`Столбец 1`, 0, this.template.Id, table.Id);

    this.templateSvc.updateTable(this.template.Id, table).subscribe({
      next: t => {
        table.Id = t.Id;
        this.templateSvc.updateField(this.template.Id, field).subscribe({
          next: f => {
            field.Id = f.Id;
            this.template.TemplateItems.push(table);      
            table.TemplateFields.push(field);
            this.showInfo("Таблица сохранена");
            this.vacantId++;
          },
          error: err => this.showError(err.error),
        });
      },
      error: err => this.showError(err.error),
    })
  }

  updateItem(item: TemplateField | TemplateTable){
    if (item.IsTable) {
      this.templateSvc.updateTable(this.template.Id, item).subscribe({
        next: () => this.showInfo("Таблица сохранена"),
        error: err =>  this.showError(err.error),
      })
    }
    else {
      this.templateSvc.updateField(this.template.Id, item).subscribe({
        next: () => this.showInfo("Поле сохранено"),
        error: err => this.showError(err.error),
      })
    }
  }

  deleteItem(item: ITemplateItem){
    this.templateSvc.deleteItem(this.template.Id, item.Id, item.IsTable).subscribe({
      error: err => this.showError(err.error),
      next: () => {
        this.showInfo(item.IsTable ? "Таблица удалена" : "Поле удалено");
        this.template.TemplateItems = this.template.TemplateItems.filter(i => i.Id != item.Id);
      }
    });
  }

  save(){
    this.templateSvc.updateTemplate(this.template).subscribe({
      error: err => this.showError(err.error),
      next: () => this.showInfo("Шаблон сохранён")
    });
  }

  delete(){
    this.templateSvc.deleteTemplate(this.template.Id).subscribe({
      next: () => this.router.navigate(["/templates"]),
      error: err =>  this.showError(err.error)
    });
  }
}
