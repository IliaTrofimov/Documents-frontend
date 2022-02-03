import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { TemplatesService } from '../services/templates.service';
import { DocTemplate, TableField, InputField, RestrictionTypes, TemplateType, InputFieldType } from '../models';

@Component({
  selector: 'app-templates-view',
  templateUrl: './template-view.component.html',
  providers: [TemplatesService]
})
export class TemplateViewComponent implements OnInit {
  template: DocTemplate = new DocTemplate(-1, "");
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

  changeOrder(oldOrder: number, delta: number){
    let newOrder = oldOrder + delta;
    if (newOrder < this.template.fields.length - 1 && newOrder >= 0){
      this.template.fields[newOrder].order = oldOrder;
      this.template.fields[oldOrder].order = newOrder;
      [this.template.fields[newOrder], this.template.fields[oldOrder]] = [this.template.fields[oldOrder], this.template.fields[newOrder]];
    }
  }

  editField(id: number){
    this.selectedIndex = id == this.selectedIndex ? -1 : id; 
  }

  addField(){
    this.selectedIndex = this.template.fields.push(new InputField("")) - 1;
  }

  addTable(){
    this.selectedIndex = this.template.fields.push(new TableField("", [], 5)) - 1;
  }

  deleteField(id: number){
    this.template.fields.splice(id, 1);
  }

  onTableChanged(table: any, index: number){
    if(this.template)
      this.template.fields[index] = table;
  }

  save(){
    this.templateServ.updateTemplate(this.template).subscribe({
      error: error => this.status = error,
      complete: () => this.status = "ok"
    });
  }

  delete(){
    this.templateServ.deleteTemplate(this.template.id).subscribe();
    this.router.navigate(["/templates"]);
  }
}
