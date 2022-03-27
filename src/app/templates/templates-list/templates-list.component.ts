import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Template } from '../../models/template';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsService]
})
export class TemplatesListComponent implements OnInit {
  templates: Template[] = [];
  status?: [boolean, string];

  constructor(private templateSvc: TemplatesService, 
    private documetnsSvc: DocumentsService,
    private utilitySvc: UtilityService,
    private router: Router) {
  } 

  ngOnInit(): void {
    this.templateSvc.getTemplates().subscribe({
      next: templates => {
        this.templates = templates;
      },
      //error: err => this.router.navigate(['error'], { queryParams: {
      //  title: "Не удалось загрузить список шаблонов", 
      //  error: JSON.stringify(err.error, null, 2)
      //}})
    })

  }
  
  addTemplate() {
    this.templateSvc.createTemplate().subscribe({
      next: (templateId) => this.router.navigate(["templates/" + templateId]),
      error: (err) => this.status = [false, err.error]
    });
  }

  removeTemplate(id: number) {
    this.templateSvc.deleteTemplate(id).subscribe({
      next: () => this.templates = this.templates.filter(template => template.Id !== id),
      error: (err) => this.status = [false, err.error] 
    });
  }

  createDocument(templateId: number) {
    this.documetnsSvc.createDocument(templateId).subscribe({
      next: (id) => this.router.navigate(["documents/" + id]),
      error: (err) => this.status = [false, err.error]
    });
  }
}
