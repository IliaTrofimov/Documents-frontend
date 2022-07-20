import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { TemplateTypesService } from 'src/app/services/template-types.service';
import { Template } from 'src/app/models/template';
import { TemplateType } from 'src/app/models/template-type';


/** Модальное окно для создания нового шаблона документа */
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