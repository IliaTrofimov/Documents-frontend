import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position';
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
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.positionsSvc.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": "Не удалось загрузить список типов должностей", 
          "error": JSON.stringify(err.error, null, 2)
        }});
      }
    });
  }

  addPosition(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewPositionDialog, {data: new Position(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.positionsSvc.createPosition(result).subscribe({
          next: id => {
            console.log('ok'); 
            result.Id = id;
            this.positions?.push(result);
          },
          error: err => console.log(JSON.stringify(err, null, 2))
        })
      }
    });
  }

  editPosition(type: Position){
    this.positionsSvc.updatePosition(type).subscribe({
      next: () => {
        console.log('ok'); 
        this.selected = -1;
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    })
  }

  removePosition(id: number) {
    this.selected = -1;
    this.positionsSvc.deletePosition(id).subscribe({
      next: () => {
        console.log('ok'); 
        this.positions = this.positions.filter(type => type.Id !== id)
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    });
  }
}
