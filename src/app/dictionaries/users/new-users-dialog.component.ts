import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';


@Component({
  selector: 'new-user-dialog',
  templateUrl: 'new-user-dialog.component.html'
})
export class NewUserDialog {
  constructor(public dialogRef: MatDialogRef<NewUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User) { }

  onClose(status: boolean){
    this.dialogRef.close(status ? this.data : undefined);
  }
}