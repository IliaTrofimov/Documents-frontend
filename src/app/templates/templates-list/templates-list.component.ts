import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { Template } from '../../models/template';
import { TemplatesService } from '../../services/templates.service';
import { DocumentsService } from '../../services/documents.service';
import { AlertService } from 'src/app/services/alert.service';
import { TemplateType } from 'src/app/models/template-type';
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
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() authorId: number = -1;
  @Input() templateId: number = -1;
  @Input() maxPages: number = 0;
  templateTypes?: TemplateType[];

  constructor(private templateSvc: TemplatesService, 
    private documetnsSvc: DocumentsService,
    private router: Router,
    private alertSvc: AlertService,
    public dialog: MatDialog) {} 


  ngOnInit(): void {
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
      "user": this.authorId
    };
    this.templateSvc.getTemplates().subscribe(templates => this.templates = templates);
    this.templateSvc.count(query).subscribe(count => this.maxPages = Math.floor(count / this.pageSize));
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
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
    this.documetnsSvc.createDocument("Новый документ" , templateId).subscribe(id => this.router.navigate(["documents/" + id]));
  }
}
