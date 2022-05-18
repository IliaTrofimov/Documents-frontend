import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { TemplateType } from '../../models/template-type';
import { TemplateTypesService } from '../../services/template-types.service';
import { NewTypeDialog } from './new-type-dialog.component';


@Component({
  selector: 'template-types-list',
  templateUrl: './template-types.component.html',
  providers: [TemplateTypesService]
})
export class TemplateTypesComponent implements OnInit {
  types?: TemplateType[];
  selected = -2;
  displayedColumns = ['Id', 'Name', 'Edit'];

  constructor(private typesSvc: TemplateTypesService, 
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService) { }

  ngOnInit(): void {
    this.typesSvc.getTypes().subscribe({
      next: types => this.types = types,
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
  }

  addType(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewTypeDialog, {data: new TemplateType(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.typesSvc.createType(result).subscribe({
          next: id => {
            this.alertSvc.info("Тип создан", {message: "Обновите страницу", autoClose: true, single: true});
            result.Id = id;
            this.types?.push(result);
          },
          error: err => this.alertSvc.error("Не удалось создать тип", {message: JSON.stringify(err, null, 2)})
        })
      }
    });
  }

  editType(type: TemplateType){
    this.typesSvc.updateType(type).subscribe({
      next: () => {
        this.alertSvc.info("Тип обновлён", {autoClose: true, single: true});
        this.selected = -1;
      },
      error: err => this.alertSvc.error("Не удалось изменить тип", {message: JSON.stringify(err, null, 2)})
    })
  }

  removeType(id: number) {
    this.selected = -1;
    if (this.types){
      this.typesSvc.deleteType(id).subscribe({
        next: () => {
          console.log('ok'); 
          this.alertSvc.info("Тип удалён", {autoClose: true, single: true});
          this.types = this.types?.filter(type => type.Id !== id)
        },
        error: err => this.alertSvc.error("Не удалось удалить тип", {message: JSON.stringify(err, null, 2)})
      });
    }
  }
}
