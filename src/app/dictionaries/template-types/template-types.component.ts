import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateType } from '../../models/template-type';
import { TemplateTypesService } from '../../services/template-types.service';


@Component({
  selector: 'template-types-list',
  templateUrl: './template-types.component.html',
  providers: [TemplateTypesService]
})
export class TemplateTypesComponent implements OnInit {
  types: TemplateType[] = [];
  newType: TemplateType = new TemplateType(-1, "");
  selected = -2;
  displayedColumns = ['Id', 'Name', 'Edit'];

  constructor(private typesSvc: TemplateTypesService, private router: Router) { }

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
    this.typesSvc.deleteType(id).subscribe({
      next: () => {
        console.log('ok'); 
        this.types = this.types.filter(type => type.Id !== id)
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    });
  }
}
