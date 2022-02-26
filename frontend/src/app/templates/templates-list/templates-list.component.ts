import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';
import { DocTemplate, TemplateType } from '../../models/template-models';

@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsService]
})
export class TemplatesListComponent implements OnInit {
  templates: DocTemplate[] = [];
  templateTypes: TemplateType[] = [];
  status?: [boolean, string];

  constructor(private templateSvc: TemplatesService, 
    private router: Router,
    private documentsServ: DocumentsService) {
  } 

  ngOnInit(): void {
    let error: any = undefined;

    this.templateSvc.getTemplates().subscribe({
      next: templates => {
        this.templates = templates;
        this.templateSvc.getTypes().subscribe({
          next: types => this.templateTypes = types,
          error: err => error = err
        });
      },
      error: err => error = err
    })

    if (error){
      this.router.navigate(['error'], { queryParams: {
        "title": "Не удалось загрузить список шаблонов", 
        "error": error.error
      }});
    }
  }
  
  addTemplate() {
    this.templateSvc.createTemplate().subscribe((t: DocTemplate) => {
      this.router.navigate(["templates/" + t.id]);
    });
  }

  removeTemplate(id: number) {
    this.templateSvc.deleteTemplate(id).subscribe({
      next: () => this.templates = this.templates.filter(template => template.id !== id),
      error: (err) => this.status = [false, err.error] 
    });
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
