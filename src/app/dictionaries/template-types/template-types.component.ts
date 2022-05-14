import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.typesSvc.getTypes().subscribe({
      next: types => this.types = types,
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": "Не удалось загрузить список типов шаблонов", 
          "error": JSON.stringify(err.error, null, 2)
        }});
      }
    });
  }

  addType(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewTypeDialog, {data: new TemplateType(-1, "")});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.typesSvc.createType(result).subscribe({
          next: id => {
            console.log('ok'); 
            result.Id = id;
            this.types?.push(result);
          },
          error: err => console.log(JSON.stringify(err, null, 2))
        })
      }
    });
  }

  editType(type: TemplateType){
    this.typesSvc.updateType(type).subscribe({
      next: () => {
        console.log('ok'); 
        this.selected = -1;
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    })
  }

  removeType(id: number) {
    this.selected = -1;
    if (this.types){
      this.typesSvc.deleteType(id).subscribe({
        next: () => {
          console.log('ok'); 
          this.types = this.types?.filter(type => type.Id !== id)
        },
        error: err => console.log(JSON.stringify(err, null, 2))
      });
    }
  }
}
