import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Template } from 'src/app/models/template';
import { TemplateType } from 'src/app/models/template-type';
import { TemplateTypesService } from 'src/app/services/template-types.service';


@Component({
  selector: 'new-template-dialog',
  templateUrl: 'new-template-dialog.component.html',
  providers: [TemplateTypesService] 
})
export class NewTemplateDialog implements OnInit{
  types?: TemplateType[];
  template: Template = new Template();

  constructor(public dialogRef: MatDialogRef<NewTemplateDialog>,
    private typesSvc: TemplateTypesService) { }

  ngOnInit(){
    this.typesSvc.getTypes().subscribe(types => this.types = types);
    this.template.Id = -1;
  }
}