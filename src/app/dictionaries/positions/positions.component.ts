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
  selected: Position = new Position(-1, "");
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
    this.selected = new Position(-1, "");
    const dialogRef = this.dialog.open(NewPositionDialog, {data: new Position(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result instanceof Position) {
        this.alertSvc.info("Должность создана", {closeTime: 5000, single: true, keepAfterRouteChange: true});
        location.reload();
      }
      else 
        this.alertSvc.error("Не удалось создать должность", {message: JSON.stringify(result, null, 2)});
    });
  }

  beginEdit(position: Position){
    this.selected.Id = position.Id;
    this.selected.Name = position.Name;
  }

  reset(position: Position){
    position.Id = this.selected.Id;
    position.Name = this.selected.Name;
    this.selected = new Position(-1, "");
  }

  editPosition(type: Position){
    this.positionsSvc.updatePosition(type).subscribe({
      next: () => {
        this.alertSvc.info("Должность обновлена", {autoClose: true, single: true});
        this.selected = new Position(-1, "");
      },
      error: err => this.alertSvc.error("Не удалось изменить должность", {message: JSON.stringify(err, null, 2)})
    })
  }

  removePosition(id: number) {
    this.selected = new Position(-1, "");
    this.positionsSvc.deletePosition(id).subscribe({
      next: () => {
        this.alertSvc.info("Должность удалена", {autoClose: true, single: true});
        this.positions = this.positions.filter(type => type.Id !== id)
      },
      error: err => this.alertSvc.error("Не удалось удалить должность", {message: JSON.stringify(err, null, 2)})
    });
  }
}
