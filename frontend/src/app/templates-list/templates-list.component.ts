import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../services/templates.service';
import { DocumentsDataService } from '../services/documents-data.service';
import { DocumentsInfoService } from '../services/documents-info.service';
import { DocTemplate, TemplateType, DocumentInfo } from '../models';

@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsDataService, DocumentsInfoService]
})
export class TemplatesListComponent implements OnInit {
  templates: DocTemplate[] = [];
  templateTypes: TemplateType[] = [];

  constructor(private templateServ: TemplatesService, 
    private router: Router,
    private infoServ: DocumentsInfoService, 
    private dataServ: DocumentsDataService, ) {
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
    this.infoServ.createDocument(templateId).subscribe((info: DocumentInfo) => {
      this.dataServ.createDocument(info.id).subscribe((data) => {
        this.router.navigate(["documents/" + info.id]);
      });
    });
    
  }
}
