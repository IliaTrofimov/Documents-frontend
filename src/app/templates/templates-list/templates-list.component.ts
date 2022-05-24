import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { Template } from '../../models/template';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';
import { AlertService } from 'src/app/services/alert.service';
import { TemplateType } from 'src/app/models/template-type';
import { TemplateTypesService } from 'src/app/services/template-types.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTemplateDialog } from './new-template-dialog.component';


@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService, DocumentsService]
})
export class TemplatesListComponent implements OnInit {
  displayedColumns = ['Name', 'AuthorName', 'UpdateDate', 'Depricated', 'Actions'];
  @Input() templates?: Template[];
  templateTypes?: TemplateType[];

  constructor(private templateSvc: TemplatesService, 
    private documetnsSvc: DocumentsService,
    private router: Router,
    private alertSvc: AlertService,
    public dialog: MatDialog) {} 


  ngOnInit(): void {
    if (!this.templates)
      this.templateSvc.getTemplates().subscribe(templates => this.templates = templates);
  }
  
  addTemplate() {
    const dialogRef = this.dialog.open(NewTemplateDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) 
        this.templateSvc.createTemplate(result).subscribe(templateId => this.router.navigate(["templates/" + templateId]));
    });
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
