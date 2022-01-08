import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { TemplatesService } from '../services/templates.service';
import { DocTemplate, TableField, InputField, RestrictionTypes, TemplateType } from '../models';

@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService]
})
export class TemplateViewComponent implements OnInit {
  template?: DocTemplate;
  templateTypes: TemplateType[] = [];
  selectedIndex: number = -1;
  status?: string; 
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
    this.templateServ.getTypes().subscribe(data => this.templateTypes = data);
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

  onTableChanged(table: any, index: number){
    if(this.template)
      this.template.fields[index] = table;
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
