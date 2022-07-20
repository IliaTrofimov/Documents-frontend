import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Position } from 'src/app/models/position';
import { PositionsService } from 'src/app/services/positions.service';


/** Модальное окно для создания новой должности */
@Component({
  selector: 'new-type-dialog',
  templateUrl: 'new-position-dialog.component.html',
  providers: [PositionsService]
})
export class NewPositionDialog {
  constructor(public dialogRef: MatDialogRef<NewPositionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Position,
    private positionsSvc: PositionsService) { }

    ok(){
      this.positionsSvc.createPosition(this.data).subscribe({
        next: id => {
          this.data.Id = id;
          this.dialogRef.close(this.data);
        },
        error: error => this.dialogRef.close(undefined)
      })
    }
}