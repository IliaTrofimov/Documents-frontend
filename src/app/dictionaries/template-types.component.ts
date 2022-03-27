import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Template } from '../models/template';
import { TemplateType } from '../models/template-type';
import { TemplateTypesService } from '../services/template-types.service';


@Component({
  selector: 'template-types-list',
  templateUrl: './template-types.component.html',
  providers: [TemplateTypesService]
})
export class TemplateTypesComponent implements OnInit {
  types: TemplateType[] = [];
  newType: TemplateType = new TemplateType(-1, "");
  selection: number = -1;

  constructor(private typesSvc: TemplateTypesService, private router: Router) { }

  ngOnInit(): void {
    console.log("loading types...")
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

  setSelection(index: number = -1){
    if (this.selection == index) this.selection = -1;
    else this.selection = index;
  }
  
  editType(type: TemplateType){
    if(type.Id == -1){
      this.typesSvc.createType(type.Name).subscribe(
        typeId => this.types.push(new TemplateType(typeId, type.Name))
      );
    }
    else{
      this.typesSvc.updateType(type).subscribe();
    }
    
    this.selection = -2;
  }

  addType(){
    this.newType.Name = "";
    this.selection = -1;
  }

  removeType(id: number) {
    this.selection = 0;
    this.typesSvc.deleteType(id).subscribe(() => 
      this.types = this.types.filter(type => type.Id !== id)
    );
  }
}
