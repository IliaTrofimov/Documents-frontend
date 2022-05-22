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

  template?: Template;
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
    });
    this.typesSvc.getTypes().subscribe(data => {
      this.templateTypes = data;
    });
  }

  changeUsage(){
    if (!this.template) return;

    this.template.Depricated = !this.template.Depricated;
    this.save();
  }

  changeOrder(oldOrder: number, delta: number){
    if (!this.template) return;

    let newOrder = oldOrder + delta;
    if (newOrder < this.template.TemplateItems.length && newOrder >= 0){
      let id_1 = this.template.TemplateItems[oldOrder].Id;
      let id_2 = this.template.TemplateItems[newOrder].Id;
      this.templateSvc.moveItems(this.template.Id, id_1, id_2).subscribe(() => 
        this.alertSvc.info("Поле перемещено", {single: true, closeTime: 5000})
      );
      [this.template.TemplateItems[newOrder], this.template.TemplateItems[oldOrder]] = 
      [this.template.TemplateItems[oldOrder], this.template.TemplateItems[newOrder]];
    }
  }

  addField(){
    if (!this.template) return;

    let field = new TemplateField("Новое поле", this.vacantId, this.template.Id);
    this.templateSvc.updateField(this.template.Id, field).subscribe(f => {
      if (!this.template) return;

      field.Id = f.Id;
      this.template.TemplateItems.push(field);    
      this.vacantId++;
      this.alertSvc.info("Поле сохранено");
    });
  }

  addColumn(column: TemplateField){
    if (!this.template) return;

    this.templateSvc.updateField(this.template.Id, column).subscribe(f => {
      column.Id = f.Id;
      this.alertSvc.info("Столбец сохранен");
    });
  }

  addTable(){
    if (!this.template) return;

    let table = new TemplateTable(this.template.Id, "Новая таблица", 1);

    this.templateSvc.updateTable(this.template.Id, table).subscribe(t => {
      table.Id = t.Id;
      this.alertSvc.info("Таблица создана");
    });
  }

  updateItem(item: TemplateField | TemplateTable){
    if (!this.template) return;

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
    if (!this.template) return;

    this.templateSvc.deleteItem(this.template.Id, item.Id, item.IsTable).subscribe(() => {
      if (!this.template) return;

      this.alertSvc.info(item.IsTable ? "Таблица удалена" : "Поле удалено");
      this.template.TemplateItems = this.template.TemplateItems.filter(i => i.Id != item.Id);
    });
  }

  save(){
    if (!this.template) return;
    this.templateSvc.updateTemplate(this.template).subscribe(() => this.alertSvc.info("Шаблон сохранён"));
  }

  delete(){
    if (!this.template) return;
    this.templateSvc.deleteTemplate(this.template.Id).subscribe(() => this.router.navigate(["/templates"]));
  }
}
