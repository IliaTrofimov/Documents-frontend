import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { Document, DocumentStatus } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { ValidationService } from '../../services/validation.service';
import { TemplateField } from 'src/app/models/template-field';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { TemplateTable } from 'src/app/models/template-table';


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
    private router: Router) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.docSvc.getDocument(this.id).subscribe({
      next: document => {
        this.document = document;
        console.log(`loaded data (id ${this.id}):`, JSON.stringify(this.document, null, 2))
      },
      error: err =>  {
         console.log(JSON.stringify(err, null, 2))
      }
    });
  }

  getItem(fieldId: number){
    return this.document?.DocumentDataItems.find(i => i.FieldId == fieldId);
  }

  getColumns(table: TemplateTable){
    let columns: DocumentDataItem[] = [];
    if (this.document){
      for (let field of table.TemplateFields)
        columns.concat(this.document.DocumentDataItems.filter(i => i.FieldId == field.Id));
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
        this.status = [false, "Документ не сохранён, недопустимые значения"]
      }
    });
    return validated;
  }

  save(){
    if (!this.document)
      return;

    console.log(JSON.stringify(this.document, null, 2));
    for (let i of this.document.DocumentDataItems){
      this.docSvc.updateItem(this.document.Id, i).subscribe({
        error: error => this.status = [false, JSON.stringify(error.error, null, 2)],
        complete: () => this.status = [true, "Поле сохранено"]
      });
    }
    this.docSvc.updateDocument(this.document).subscribe({
      error: error => this.status = [false, JSON.stringify(error.error, null, 2)],
      //complete: () => this.status = [true, "Документ сохранён"]
    });
  }

  updateItem(item: DocumentDataItem){
    if (!this.document)
      return;

    this.docSvc.updateDocument(this.document).subscribe({
      error: error => this.status = [false, error.error],
      complete: () => this.status = [true, "Поле сохранено"]
    });
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
}
