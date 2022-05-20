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
  displayedColumns = ['Id', 'Name', 'Position','Edit'];

  constructor(private typesSvc: TemplateTypesService, 
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService,
    private detector: ChangeDetectorRef,
    private positionsSvc: PositionsService) { }

  ngOnInit(): void {
    this.typesSvc.getTypes().subscribe({
      next: types => {this.types = types; console.log(types)},
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
    this.positionsSvc.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
  }

  addType(){
    this.selected = new TemplateType(-1, "");
    const dialogRef = this.dialog.open(NewTypeDialog, {data: new TemplateType(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result instanceof Template) {
        this.alertSvc.info("Тип шаблона создан", {closeTime: 5000, single: true, keepAfterRouteChange: true});
        location.reload();
      }
      else 
        this.alertSvc.error("Не удалось создать тип", {message: JSON.stringify(result, null, 2)});
    });
  }

  beginEdit(type: TemplateType){
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

    this.typesSvc.updateType(type).subscribe({
      next: () => {
        this.alertSvc.info("Тип обновлён", {closeTime: 5000, single: true});
        this.selected = new TemplateType(-1, "");
      },
      error: err => this.alertSvc.error("Не удалось изменить тип", {message: JSON.stringify(err, null, 2)})
    })
  }

  removeType(id: number) {
    this.selected = new TemplateType(-1, "");
    if (this.types){
      this.typesSvc.deleteType(id).subscribe({
        next: () => {
          console.log('ok'); 
          this.alertSvc.info("Тип удалён", {closeTime: 5000, single: true});
          this.types = this.types?.filter(type => type.Id !== id)
        },
        error: err => this.alertSvc.error("Не удалось удалить тип", {message: JSON.stringify(err, null, 2)})
      });
    }
  }
}
