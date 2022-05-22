import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { Template } from '../../models/template';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsService]
})
export class TemplatesListComponent implements OnInit {
  displayedColumns = ['Name', 'AuthorName', 'UpdateDate', 'Depricated', 'Actions'];
  @Input() templates?: Template[];

  constructor(private templateSvc: TemplatesService, 
    private documetnsSvc: DocumentsService,
    private router: Router,
    private alertSvc: AlertService) {
  } 


  ngOnInit(): void {
    if (!this.templates){
      this.templateSvc.getTemplates().subscribe(templates => this.templates = templates);
    } 
  }
  
  addTemplate() {
    this.templateSvc.createTemplate().subscribe(templateId => this.router.navigate(["templates/" + templateId]));
  }

  removeTemplate(id: number) {
    this.templateSvc.deleteTemplate(id).subscribe(() => {
      this.alertSvc.info("Шаблон удалён")
      if (this.templates) 
        this.templates = this.templates.filter(template => template.Id !== id)
    });
  }

  createDocument(templateId: number) {
    this.documetnsSvc.createDocument(templateId).subscribe(id => this.router.navigate(["documents/" + id]));
  }
}
