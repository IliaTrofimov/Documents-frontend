import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { Document, DocumentStatus } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { ValidationService } from '../../services/validation.service';
import { TemplateField } from 'src/app/models/template-field';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { TemplateTable } from 'src/app/models/template-table';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService, ValidationService]
})
export class DocumentViewComponent implements OnInit {
  Field = TemplateField;
  Table = TemplateTable;

  document?: Document;
  status?: [boolean, string];
  preparedData: { items: DocumentDataItem[], templateFields: TemplateField[], table?: TemplateTable }[] = [];
  private id: number = -1;

  constructor(private docSvc: DocumentsService,
    private validSvc: ValidationService,
    private route: ActivatedRoute, 
    private router: Router,
    private alertSvc: AlertService) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.docSvc.getDocument(this.id).subscribe(document => {
      this.document = document;
      console.log(`loaded data (id ${this.id}):`, JSON.stringify(this.document, null, 2))
    }); 
  }

  getItem(fieldId: number){
    return this.document?.DocumentDataItems.find(i => i.FieldId == fieldId);
  }

  getColumns(table: TemplateTable){
    let columns: DocumentDataItem[] = [];
    if (this.document){
      for (let field of table.TemplateFields)
        columns = columns.concat(this.document.DocumentDataItems.filter(i => i.FieldId == field.Id));
    }
    return columns;
  }


  validate(){
    let validated = true;
    let listner = this.validSvc.start().subscribe({
      complete: () => {
        validated = true;
        this.save();
      },
      error: () => {
        validated = false;
        this.alertSvc.info("Документ не сохранён, проверьте введённые значения");
      }
    });
    return validated;
  }

  save(){
    if (!this.document)
      return;
    for (let i of this.document.DocumentDataItems)
      this.docSvc.updateItem(this.document.Id, i).subscribe(() => this.alertSvc.info("Данные сохранены"));
    this.docSvc.updateDocument(this.document).subscribe(() => this.alertSvc.info("Документ сохранён"));
  }

  updateItem(item: DocumentDataItem){
    if (!this.document)
      return;
    this.docSvc.updateItem(this.document.Id, item).subscribe(() => this.alertSvc.info("Данные сохранены"));
  }

  delete(){
    if (!this.document)
      return;

    this.docSvc.deleteDocument(this.document.Id).subscribe();
    this.router.navigate(["/documents"]);
  }

  nextType(){
    if (!this.document)
      return;
    if (this.document.Type != DocumentStatus.Old) {
      if (this.document.Type == DocumentStatus.InWork) {
        this.validate();
      }
      else{
        this.document.Type++;
        this.save();
      }
    }
  }
  
  getDocumentStatusAction(){
    switch(this.document?.Type){
      case DocumentStatus.InWork: return "Передать на подписание";
      case DocumentStatus.Signing: return "Подписать";
      case DocumentStatus.InUse: return "Вывести из оборота";
      default: return "";
    }
  }
}
