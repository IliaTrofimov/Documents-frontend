import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TemplatesService } from '../templates-service';
import { DocTemplate, TableField, InputField } from '../models';

@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService]
})
export class TemplateViewComponent implements OnInit {
  template?: DocTemplate;
  private id: number = -1;
  status?: string;
  selectedIndex: number = -1;

  constructor(private templateServ: TemplatesService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.templateServ.getTemplateById(this.id).subscribe({
      next: data => this.template = data,
      error: error => this.router.navigate(['not-found'], { 
        queryParams: {
          "requestedId": this.id, 
          "requestedObject": "шаблон"
        } 
      })
    });
  }

  editField(id: number){
    this.selectedIndex = id == this.selectedIndex ? -1 : id; 
  }

  addField(){
    this.template?.fields.push(new InputField("Новое поле"));
  }

  addTable(){
    this.template?.fields.push(new TableField("Новая таблица", [], 5));
  }

  deleteField(id: number){
    this.template?.fields.splice(id, 1);
  }

  deleteTableColumn(tableId: number, columnId: number){
    (this.template?.fields[tableId] as TableField).columns.splice(columnId, 1);
  }

  addTableColumn(tableId: number){
    (this.template?.fields[tableId] as TableField).columns.push(new InputField("Новый столбец"));
  }

  save(){
    if(this.template)
      this.templateServ.updateTemplate(this.template).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      }
    );
  }

  delete(){
    if(this.template){
      this.templateServ.deleteTemplate(this.template.id).subscribe();
      this.router.navigate(["/templates"]);
    }
  }

}
