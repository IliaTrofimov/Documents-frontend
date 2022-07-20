import { switchMap } from 'rxjs/operators';
import { Component, NgZone, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from 'src/app/services/alert.service';
import { PrintingService } from 'src/app/services/printing.service';
import { DocumentsService } from 'src/app/services/documents.service';
import { ValidationService } from 'src/app/services/validation.service';
import { SignatoriesService } from 'src/app/services/signatories.service';
import { TemplateField } from 'src/app/models/template-field';
import { DocumentDataItem } from 'src/app/models/document-data-item';
import { TemplateTable } from 'src/app/models/template-table';
import { Signatory } from 'src/app/models/signatory';
import { Document, DocumentStatus } from 'src/app/models/document';
import { DocumentSignigComponent } from './document-signing.component';


/** Страница с просмотром данных документа */
@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService, ValidationService, SignatoriesService, PrintingService]
})
export class DocumentViewComponent implements OnInit {
  Field = TemplateField;
  Table = TemplateTable;
  htmlTemplateExists: boolean = false;
  isValidated: boolean = true;
  document?: Document;
  signatories: Signatory[] = [];
  private id: number = -1;

  get readonly(){
    return this.document?.Type != 0;
  }

  constructor(private docSvc: DocumentsService,
    private validSvc: ValidationService,
    private route: ActivatedRoute, 
    private router: Router,
    private alertSvc: AlertService,
    private dialog: MatDialog,
    private signsSvc: SignatoriesService,
    private zone: NgZone,
    private printSvc: PrintingService) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.docSvc.getDocument(this.id).subscribe(document => {
      this.document = document;
      this.printSvc.checkExistance(this.document.TemplateId).subscribe(res => this.htmlTemplateExists = res);
      this.signsSvc.getSigns({"documentId": this.document.Id, "showUnassigned": true}).subscribe(signs => this.signatories = signs);
    });
  }

  getPdf(){
    this.printSvc.printPdfDocument(this.id, this.document?.Name);
  }

  setSigners(){
    const dialogRef = this.dialog.open(DocumentSignigComponent, {data:  {
      signatories: this.signatories, 
      positions: this.document?.Template?.TemplateType.Positions
    }});
    this.zone.run(() => 
      dialogRef.afterClosed().subscribe(res => {
        if (res){
          this.alertSvc.info("Подписанты сохранены");
          this.signatories = res;
        }
      })
    );
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
    this.zone.run(() => {
      this.validSvc.start().subscribe({
        complete: () => {
          validated = true;
          if (!this.document) return;
          for (let i of this.document.DocumentDataItems)
            this.docSvc.updateItem(this.document.Id, i).subscribe(() => this.alertSvc.info("Данные сохранены"));
          
          this.sign();
        },
        error: () => {
          validated = false;
          this.alertSvc.warn("Документ не сохранён, проверьте введённые значения");
        }
      });
    })
    
    return validated;
  }

  save(item?: DocumentDataItem){
    if (this.document)
      if (item)
        this.docSvc.updateItem(this.document.Id, item).subscribe(() => this.alertSvc.info("Данные сохранены"))
      else
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

  sign(){
    if (!this.document)
      return;

    for(let s of this.signatories)
      if (s.UserCWID == undefined) {
        this.alertSvc.warn("Нельзя передать на подписание, не все подписанты выбраны");
        return;
      }
  
    this.document.Type = DocumentStatus.Signing;
    this.docSvc.updateDocument(this.document).subscribe(() => this.alertSvc.info("Передан на подписание")); 

    for (let s of this.signatories)
      this.signsSvc.notify(s).subscribe();

  }

  retire(){
    if (!this.document)
      return;
    this.document.Type = DocumentStatus.Old;
    this.docSvc.updateDocument(this.document).subscribe(() => {
      this.alertSvc.info("Документ отмечен как устаревший");
    }); 
  }
  
  getDocumentStatusAction(){
    switch(this.document?.Type){
      case DocumentStatus.InWork: return "Передать на подписание";
      case DocumentStatus.Signing: return "На подписании";
      case DocumentStatus.InUse: return "Вывести из оборота";
      default: return "";
    }
  }
}
