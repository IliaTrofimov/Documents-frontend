import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position';
import { Template } from 'src/app/models/template';
import { AlertService } from 'src/app/services/alert.service';
import { PositionsService } from 'src/app/services/positions.service';
import { TemplateType } from '../../models/template-type';
import { TemplateTypesService } from '../../services/template-types.service';
import { NewTypeDialog } from './new-type-dialog.component';


@Component({
  selector: 'template-types-list',
  templateUrl: './template-types.component.html',
  providers: [TemplateTypesService, PositionsService],
  styleUrls: ['../styles.css']
})
export class TemplateTypesComponent implements OnInit {
  types?: TemplateType[];
  positions?: Position[];
  selected: TemplateType = new TemplateType(-1, "");
  selectedPositions: Position[] = [];
  displayedColumns = ['Id', 'Name', 'Position','Edit'];

  constructor(private typesSvc: TemplateTypesService, 
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService,
    private detector: ChangeDetectorRef,
    private positionsSvc: PositionsService) { }

  ngOnInit(): void {
    this.typesSvc.getTypes().subscribe(types => this.types = types);
    this.positionsSvc.getPositions().subscribe(positions => this.positions = positions);
  }

  addType(){
    this.selected = new TemplateType(-1, "");
    const dialogRef = this.dialog.open(NewTypeDialog, {data: {type: new TemplateType(-1, ""), positions: this.positions}});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types?.push(result);
        this.alertSvc.info("Тип шаблона создан");
        this.detector.detectChanges();
      }
    });
  }

  beginEdit(type: TemplateType){
    this.selectedPositions = [];
    this.selected.TemplateTypePositions = [];
    for (let pos of type.TemplateTypePositions){
      if (pos.Position){
        this.selectedPositions.push(pos.Position);
        this.selected.TemplateTypePositions.push(pos);
      }
    }
    this.selected.Id = type.Id;
    this.selected.Name = type.Name;
  }

  reset(type: TemplateType){
    type.Id = this.selected.Id;
    type.Name = this.selected.Name;
    this.selected = new TemplateType(-1, "");
  }

  editType(type: TemplateType){
    if (!type.Name){
      this.alertSvc.error("Заполните обязательные поля", {closeTime: 5000});
      return;
    }
    
    for(let p of this.selectedPositions)
      type.TemplateTypePositions.push({Id: -1, TemplateTypeId: type.Id, Position: p});

    this.typesSvc.updateType(type).subscribe(() => {
      this.alertSvc.info("Тип обновлён", {closeTime: 5000, single: true});
      this.selected = new TemplateType(-1, "");
    })
  }

  removeType(id: number) {
    this.selected = new TemplateType(-1, "");
    if (this.types){
      this.typesSvc.deleteType(id).subscribe(() => {
        this.alertSvc.info("Тип удалён", {closeTime: 5000, single: true});
        this.types = this.types?.filter(type => type.Id !== id)
      });
    }
  }
}
