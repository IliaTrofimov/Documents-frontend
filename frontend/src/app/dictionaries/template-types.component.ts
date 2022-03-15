import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateType } from '../models/template-type';
import { TemplateTypesService } from '../services/template-types.service';


@Component({
  selector: 'template-types-list',
  templateUrl: './template-types.component.html',
  providers: [TemplateTypesService]
})
export class TemplateTypesComponent implements OnInit {
  types: TemplateType[] = [];
  newTypeName: string = "";
  selection: number = 0;


  constructor(private typesSvc: TemplateTypesService, private router: Router) { }

  ngOnInit(): void {
    console.log("loading types...")
    this.typesSvc.getTypes().subscribe({
      next: types => this.types = types,
      error: err => {
        //this.router.navigate(['error'], { queryParams: {
        //  "title": "Не удалось загрузить список типов шаблонов", 
        //  "error": JSON.stringify(err.error, null, 2)
        //}});
      }
    });
  }
  
  editType(type: TemplateType){
    this.typesSvc.updateType(type).subscribe();
    this.selection = 0;
  }

  addType(){
    this.typesSvc.createType(this.newTypeName).subscribe({
      next: id => this.types.push(new TemplateType(id, this.newTypeName))
    });
    this.newTypeName = "";
  }

  removeType(id: number) {
    this.selection = 0;
    this.typesSvc.deleteType(id).subscribe(() => 
      this.types = this.types.filter(type => type.Id !== id)
    );
  }
}
