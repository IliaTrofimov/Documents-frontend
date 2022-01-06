import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../services/templates.service';
import { DocTemplate } from '../models';

@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService]
})
export class TemplatesListComponent implements OnInit {
  templates: DocTemplate[] = [];
  types: Array<[number, string]> = [];

  constructor(private templateServ: TemplatesService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadTemplates();
    this.templateServ.getTypes().subscribe(next => this.types);
  }

  private loadTemplates(): void {
    this.templateServ.getTemplates().subscribe((data: DocTemplate[]) => this.templates = data);
  }
  
  addTemplate() {
    this.templateServ.createTemplate().subscribe((t: DocTemplate) => 
      this.router.navigate(["templates/" + t.id])
    );
  }

  removeTemplate(id: number) {
    this.templateServ.deleteTemplate(id).subscribe((_) => {
        this.templates = this.templates.filter((t) => t.id !== id);
      }
    );
  }

  getTemplateType(typeId: number){
    let type = this.types.find(t => t[0] == typeId)
    return type ? type[1] : "Без типа";
  }
}
