import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position';
import { AlertService } from 'src/app/services/alert.service';
import { PositionsService } from 'src/app/services/positions.service';
import { NewPositionDialog } from './new-position-dialog.component';


@Component({
  selector: 'positions-list',
  templateUrl: './positions.component.html',
  providers: [PositionsService],
  styleUrls: ['../styles.css']
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  selected = -2;
  displayedColumns = ['Id', 'Name', 'Edit'];

  constructor(private positionsSvc: PositionsService, 
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService) { }

  ngOnInit(): void {
    this.positionsSvc.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
  }

  addPosition(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewPositionDialog, {data: new Position(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.positionsSvc.createPosition(result).subscribe({
          next: id => {
            this.alertSvc.info("Должность создана", {message: "Обновите страницу", autoClose: true, single: true});
            result.Id = id;
            this.positions?.push(result);
          },
          error: err => this.alertSvc.error("Не удалось создать должность", {message: JSON.stringify(err, null, 2)})
        })
      }
    });
  }

  editPosition(type: Position){
    this.positionsSvc.updatePosition(type).subscribe({
      next: () => {
        this.alertSvc.info("Должность обновлена", {autoClose: true, single: true});
        this.selected = -1;
      },
      error: err => this.alertSvc.error("Не удалось изменить должность", {message: JSON.stringify(err, null, 2)})
    })
  }

  removePosition(id: number) {
    this.selected = -1;
    this.positionsSvc.deletePosition(id).subscribe({
      next: () => {
        this.alertSvc.info("Должность удалена", {autoClose: true, single: true});
        this.positions = this.positions.filter(type => type.Id !== id)
      },
      error: err => this.alertSvc.error("Не удалось удалить должность", {message: JSON.stringify(err, null, 2)})
    });
  }
}
