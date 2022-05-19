import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateType } from 'src/app/models/template-type';
import { TemplateTypesService } from 'src/app/services/template-types.service';


@Component({
  selector: 'new-type-dialog',
  templateUrl: 'new-type-dialog.component.html',
  styleUrls: ['../styles.css'],
  providers: [TemplateTypesService]
})
export class NewTypeDialog {
  constructor(public dialogRef: MatDialogRef<NewTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TemplateType, 
    private typesSvc: TemplateTypesService) { }

  ok(){
    this.typesSvc.createType(this.data).subscribe({
      next: id => {
        this.data.Id = id;
        this.dialogRef.close(this.data);
      },
      error: error => this.dialogRef.close(error)
    })
  }
}