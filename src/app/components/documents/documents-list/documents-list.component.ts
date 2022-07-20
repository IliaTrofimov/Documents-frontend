import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { NewDocumentDialog } from './new-document-dialog.component';
import { AlertService } from 'src/app/services/alert.service';
import { Document, DocumentStatus } from 'src/app/models/document';
import { DocumentsService } from 'src/app/services/documents.service';

/** Страница со списком документов. Поддерживает фильтрациию и пагинацию. 
* @param {number} page - номер страницы пагинатора
* @param {number} pageSize - количество элементов на странице
* @param {number} authorId - Id автора документа (по умолчанию -1 - без фильтра)
* @param {number} templateId - Id шаблона документа (по умолчанию -1 - без фильтра)
* @param {number} type - значение статуса в документа (по умолчанию -1 - без фильтра)
* @param {boolean} isEmbeded - меняет вид компонента для того, чтобы его можно было убодно встраивать в другие контроллеры
*/
@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsService]
})
export class DocumentsListComponent implements OnInit {
  @Input() documents?: Document[];
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() authorId: string = "";
  @Input() templateId: number = -1;
  @Input() type: DocumentStatus = -1;
  maxPages: number = 0;
  @Input() isEmbeded: boolean = false;
  totalElements: number = 0;
  
  displayedColumns = ['Name', 'Template', 'AuthorName', 'UpdateDate', 'ExpireDate', 'Actions'];

  constructor(private documentsSvc: DocumentsService, 
    private router: Router, 
    private alertSvc: AlertService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
      "type":  this.type, 
      "user": this.authorId, 
      "template": this.templateId
    };
    this.documentsSvc.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize));
    this.documentsSvc.getDocuments(query).subscribe(data => this.documents = data);
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }
  
  removeDocument(id: number) {
    this.documentsSvc.deleteDocument(id).subscribe(() => {
      this.documents = this.documents?.filter(doc => doc.Id !== id);
      this.alertSvc.info("Документ удалён");
      if (this.totalElements != 0)  this.totalElements--;
    });
  }

  createDocument(){
    const dialogRef = this.dialog.open(NewDocumentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) 
        this.documentsSvc.createDocument(result.Name, result.TemplateId).subscribe(id => this.router.navigate(["/documents", id]));
    }); 
  }

  createNewVersion(document: Document){
    
  }

}
