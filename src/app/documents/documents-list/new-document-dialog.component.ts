import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Document } from 'src/app/models/document';
import { Template } from 'src/app/models/template';
import { TemplatesService } from 'src/app/services/templates.service';


@Component({
  selector: 'new-document-dialog',
  templateUrl: 'new-document-dialog.component.html',
  providers: [TemplatesService] 
})
export class NewDocumentDialog implements OnInit{
  templates?: Template[];
  document: Document = new Document();

  constructor(public dialogRef: MatDialogRef<NewDocumentDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private templatesSvc: TemplatesService) { }

  ngOnInit(){
    this.templatesSvc.getTemplates().subscribe(templates => this.templates = templates);
    this.document.TemplateId = -1;
  }
}