import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/position';
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
  selectedPositionsIds: number[] = [];
  selectedPositionsNames: string[] = [];
  displayedColumns = ['Id', 'Name', 'Position','Edit'];
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() maxPages: number = 0;
  totalElements: number = 0;

  constructor(private typesSvc: TemplateTypesService, 
    public dialog: MatDialog,
    private alertSvc: AlertService,
    private positionsSvc: PositionsService) { }

  public objComparisonFn = function(option:any, value:any) : boolean {
    return option.Id === value.Id;
  }

  ngOnInit(): void {
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
    };
    this.typesSvc.getTypes(query).subscribe(types => this.types = types);
    this.positionsSvc.getPositions().subscribe(positions => this.positions = positions);
    this.typesSvc.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize));
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }

  addType(){
    this.selected = new TemplateType(-1, "");
    const dialogRef = this.dialog.open(NewTypeDialog, {data: {type: new TemplateType(-1, ""), positions: this.positions}});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alertSvc.info("Тип шаблона создан", {keepAfterRouteChange: true});
        location.reload();
      }
    });
  }

  beginEdit(type: TemplateType){
    this.selected.Positions = [];
    for (let pos of type.Positions)
      this.selected.Positions.push(new Position(pos.Id, pos.Name));
    this.selected.Id = type.Id;
    this.selected.Name = type.Name;
  }

  reset(type: TemplateType){
    type.Id = this.selected.Id;
    type.Name = this.selected.Name;
    type.Positions = [];
    for (let pos of this.selected.Positions)
      type.Positions.push(new Position(pos.Id, pos.Name));
    this.selected = new TemplateType(-1, "");
  }

  editType(type: TemplateType){
    if (!type.Name){
      this.alertSvc.error("Заполните обязательные поля", {closeTime: 5000});
      return;
    }
    console.log(type);
    this.typesSvc.updateType(type).subscribe(() => {
      this.alertSvc.info("Тип обновлён", {closeTime: 5000, single: true});
      this.selected.Id = -1;
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
