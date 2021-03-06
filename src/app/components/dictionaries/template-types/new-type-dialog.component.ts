import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Position } from 'src/app/models/position';
import { TemplateType } from 'src/app/models/template-type';
import { TemplateTypesService } from 'src/app/services/template-types.service';


/** Модальное окно для создания нового типа */
@Component({
  selector: 'new-type-dialog',
  templateUrl: 'new-type-dialog.component.html',
  styleUrls: ['../styles.css'],
  providers: [TemplateTypesService]
})
export class NewTypeDialog { 
  constructor(public dialogRef: MatDialogRef<NewTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {type: TemplateType, positions?: Position[]}, 
    private typesSvc: TemplateTypesService) { }
   
  ok(){
    this.typesSvc.createType(this.data.type).subscribe({
      next: id => {
        this.data.type.Id = id;
        this.dialogRef.close(this.data.type);
      },
      error: error => this.dialogRef.close(undefined)
    })
  }
}