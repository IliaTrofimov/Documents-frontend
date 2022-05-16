import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateType } from 'src/app/models/template-type';


@Component({
  selector: 'new-type-dialog',
  templateUrl: 'new-type-dialog.component.html',
  styleUrls: ['../styles.css']
})
export class NewTypeDialog {
  constructor(public dialogRef: MatDialogRef<NewTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TemplateType) { }
}