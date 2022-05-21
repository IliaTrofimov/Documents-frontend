import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TemplatesService } from '../../services/templates.service';
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { Template } from 'src/app/models/template';
import { TemplateType } from "src/app/models/template-type";
import { TemplateField } from '../../models/template-field';
import { TemplateTable } from 'src/app/models/template-table';
import { ITemplateItem } from 'src/app/models/template-item';
import { AlertService } from 'src/app/services/alert.service';



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
    private alertSvc: AlertService) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.templateSvc.getTemplate(this.id).subscribe(data => {
      this.template = data;
      this.vacantId = data.TemplateItems.length;
      console.log(`received data: ${JSON.stringify(this.template, null, 2)}`);
    });
    this.typesSvc.getTypes().subscribe(data => {
      this.templateTypes = data;
      console.log(`received types: ${JSON.stringify(this.templateTypes, null, 2)}`);
    });
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
    this.templateSvc.updateField(this.template.Id, field).subscribe(f => {
      field.Id = f.Id;
      this.template.TemplateItems.push(field);    
      this.vacantId++;
      this.alertSvc.info("Поле сохранено");
    });
  }

  addColumn(column: TemplateField){
    this.templateSvc.updateField(this.template.Id, column).subscribe({
      next: () => this.alertSvc.info("Столбец сохранен"),
    });
  }

  addTable(){
    let table = new TemplateTable(this.template.Id,
      `Таблица ${this.template.TemplateItems.length + 1}`,
      1, this.vacantId);
    let field = new TemplateField(`Столбец 1`, 0, this.template.Id, table.Id);

    this.templateSvc.updateTable(this.template.Id, table).subscribe(t => {
      table.Id = t.Id;
      this.templateSvc.updateField(this.template.Id, field).subscribe(f => {
        field.Id = f.Id;
        this.template.TemplateItems.push(table);      
          table.TemplateFields.push(field);
          this.alertSvc.info("Таблица создана");
          this.vacantId++;
      });
    });
  }

  updateItem(item: TemplateField | TemplateTable){
    if (item.IsTable) {
      this.templateSvc.updateTable(this.template.Id, item).subscribe(() => 
        this.alertSvc.info("Таблица сохранена")
      );
    }
    else {
      this.templateSvc.updateField(this.template.Id, item).subscribe(() => 
        this.alertSvc.info("Поле сохранено")
      );
    }
  }

  deleteItem(item: ITemplateItem){
    this.templateSvc.deleteItem(this.template.Id, item.Id, item.IsTable).subscribe(() => {
      this.alertSvc.info(item.IsTable ? "Таблица удалена" : "Поле удалено");
      this.template.TemplateItems = this.template.TemplateItems.filter(i => i.Id != item.Id);
    });
  }

  save(){
    this.templateSvc.updateTemplate(this.template).subscribe(() => this.alertSvc.info("Шаблон сохранён"));
  }

  delete(){
    this.templateSvc.deleteTemplate(this.template.Id).subscribe(() => this.router.navigate(["/templates"]));
  }
}
