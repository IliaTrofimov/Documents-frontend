import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { Template } from "../../models/template";
import { UsersService } from '../../services/users.service';
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
  document: Document = new Document();
  template: Template = new Template();
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
    console.log(JSON.stringify(this.document, null, 2))
  }

  private loadData(){
    this.docSvc.getDocument(this.id).subscribe({
      next: document => {
        this.document = document;
        this.prepareData();
      },
      error: err =>  {
        this.router.navigate(['error'], { queryParams: {
          "title": `Не удалось загрузить документ #${this.id}`, 
          "error": JSON.stringify(err.error, null, 2)
        }});
      }
    });
  }

  prepareData(){
    if (!this.document.Template)
      return;

    let isTable = false;
    let tableId = 0;
    let fieldId = 0;

    let tableColumns: TemplateField[] = [];
    let tableCells: DocumentDataItem[] = [];
    const tables = this.document.Template.TemplateTable;
    this.preparedData = [];

    for (let templateField of this.document.Template.TemplateField){
      if (templateField.TemplateTableId) {
        if (tableId != 0 && tableId != templateField.TemplateTableId) {
          this.preparedData.push({ items: tableCells, templateFields: tableColumns, table: tables[tableId] });
          tableCells = [];
          tableColumns = [];
        }

        tableId = templateField.TemplateTableId;
        isTable = true;
        tableColumns.push(templateField);
        tableCells.concat(this.document.DocumentDataItem.slice(tableId, tableId + tables[tableId].Rows));
      }
      else {
        if (isTable) {
          this.preparedData.push({ items: tableCells, templateFields: tableColumns, table: tables[tableId] });
          tableCells = [];
          tableColumns = [];
        }

        this.preparedData.push({
          items: [this.document.DocumentDataItem[fieldId++]],
          templateFields: [templateField],
          table: undefined
        });
      }
    }
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
    this.docSvc.editDocument(this.document).subscribe({
      error: error => this.status = [false, error.error],
      complete: () => this.status = [true, "Документ сохранён"]
    });
  }

  delete(){
    this.docSvc.deleteDocument(this.document.Id).subscribe();
    this.router.navigate(["/documents"]);
  }

  nextType(){
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
