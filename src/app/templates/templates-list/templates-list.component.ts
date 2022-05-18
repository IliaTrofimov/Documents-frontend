import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Template } from '../../models/template';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';


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
    private messageBar: MatSnackBar) {
  } 

  showError(error: any){
    this.messageBar.open(`Ошибка!\n${JSON.stringify(error)}`, "Принять", {
      duration: 5000     
    }); 
  }

  ngOnInit(): void {
    if (!this.templates){
      this.templateSvc.getTemplates().subscribe({
        next: templates => {
          this.templates = templates;
        }
      });
    } 
  }
  
  addTemplate() {
    this.templateSvc.createTemplate().subscribe({
      next: templateId => this.router.navigate(["templates/" + templateId]),
      error: err => this.showError(err)
    });
  }

  removeTemplate(id: number) {
    this.templateSvc.deleteTemplate(id).subscribe({
      next: () => {
        if (this.templates) 
          this.templates = this.templates.filter(template => template.Id !== id)
      },
      error: err => this.showError(err)
    });
  }

  createDocument(templateId: number) {
    this.documetnsSvc.createDocument(templateId).subscribe({
      next: id => this.router.navigate(["documents/" + id]),
      error: err => this.showError(err)
    });
  }
}
