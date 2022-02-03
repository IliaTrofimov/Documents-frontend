import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../services/templates.service';
import { DocumentsService } from '../services/documents.service';
import { DocTemplate, TemplateType, DocumentInfo } from '../models';

@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsService]
})
export class TemplatesListComponent implements OnInit {
  templates: DocTemplate[] = [];
  templateTypes: TemplateType[] = [];

  constructor(private templateServ: TemplatesService, 
    private router: Router,
    private documentsServ: DocumentsService) {
  } 

  ngOnInit(): void {
    this.loadTemplates();
    this.templateServ.getTypes().subscribe(data => this.templateTypes = data);
  }

  private loadTemplates(): void {
    this.templateServ.getTemplates().subscribe((data: DocTemplate[]) => this.templates = data);
  }
  
  addTemplate() {
    this.templateServ.createTemplate().subscribe((t: DocTemplate) => {
      this.router.navigate(["templates/" + t.id]);
    });
  }

  removeTemplate(id: number) {
    this.templateServ.deleteTemplate(id).subscribe((_) => {
        this.templates = this.templates.filter(template => template.id !== id);
      }
    );
  }

  getTemplateType(typeId: number){
    for(let t of this.templateTypes)
      if(t.id == typeId) return t.name;
    return "Без типа";
  }

  createDocument(templateId: number){
    this.documentsServ.createJoinedDocument(templateId).subscribe((id) => {
        this.router.navigate(["documents/" + id]);
    });
  }
}
