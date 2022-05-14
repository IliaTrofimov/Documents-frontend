import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateType } from 'src/app/models/template-type';


@Component({
  selector: 'new-type-dialog',
  templateUrl: 'new-position-dialog.component.html',
})
export class NewPositionDialog {
  constructor(public dialogRef: MatDialogRef<NewPositionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TemplateType) { }
}