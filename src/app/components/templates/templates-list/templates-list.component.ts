import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';

import { TemplatesService } from 'src/app/services/templates.service';
import { DocumentsService } from 'src/app/services/documents.service';
import { AlertService } from 'src/app/services/alert.service';
import { Template } from 'src/app/models/template';
import { TemplateType } from 'src/app/models/template-type';
import { NewTemplateDialog } from './new-template-dialog.component';


/** Страница со списком шаблонов документов. Поддерживает фильтрациию и пагинацию. 
* @param {number} page - номер страницы пагинатора
* @param {number} pageSize - количество элементов на странице
* @param {number} authorId - Id автора документа (по умолчанию -1 - без фильтра)
* @param {boolean} isEmbeded - меняет вид компонента для того, чтобы его можно было убодно встраивать в другие контроллеры
*/
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
  @Input() authorId: string = "";
  maxPages: number = 0;
  @Input() isEmbeded: boolean = false;
  totalElements: number = 0;
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
    this.templateSvc.getTemplates(query).subscribe(templates => this.templates = templates);
    this.templateSvc.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize));
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
      this.alertSvc.info("Шаблон удалён");
      this.templates = this.templates?.filter(template => template.Id !== id);   
      if (this.totalElements != 0)  this.totalElements--;
    });
  }

  createDocument(templateId: number) {
    this.documetnsSvc.createDocument("Новый документ" , templateId).subscribe(id => this.router.navigate(["documents/" + id]));
  }
}
