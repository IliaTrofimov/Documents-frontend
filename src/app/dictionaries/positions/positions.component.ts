import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  positions?: Position[];
  selected: Position = new Position(-1, "");
  displayedColumns = ['Id', 'Name', 'Edit'];
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() maxPages: number = 0;

  constructor(private positionsSvc: PositionsService, 
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService,
    private detector: ChangeDetectorRef) { }

  ngOnInit(): void {
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
    };
    this.positionsSvc.getPositions(query).subscribe(positions => this.positions = positions);
    this.positionsSvc.count().subscribe(count => this.maxPages = Math.floor(count / this.pageSize));
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }

  addPosition(){
    this.selected = new Position(-1, "");
    const dialogRef = this.dialog.open(NewPositionDialog, {data: new Position(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.positions?.push(result);
        this.alertSvc.info("Должность создана");
        this.detector.detectChanges();
        this.detector.detectChanges();
        this.detector.detectChanges();
      }
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
    this.positionsSvc.updatePosition(type).subscribe(() => {
      this.alertSvc.info("Должность обновлена", {autoClose: true, single: true});
      this.selected = new Position(-1, "");
    })
  }

  removePosition(id: number) {
    this.selected = new Position(-1, "");
    this.positionsSvc.deletePosition(id).subscribe(() => {
      this.alertSvc.info("Должность удалена", {autoClose: true, single: true});
      this.positions = this.positions?.filter(type => type.Id !== id)
    });
  }
}
