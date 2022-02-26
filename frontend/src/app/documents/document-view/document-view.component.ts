import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { DocTemplate } from "../../models/template";
import { DocumentData } from 'src/app/models/document-data';
import { UsersService } from '../../services/users.service';
import { DocumentInfo, DocTypes } from '../../models/document-info';
import { DocumentsService } from '../../services/documents.service';
import { ValidationService } from '../../services/validation.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService, ValidationService]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1); 
  template: DocTemplate = new DocTemplate(-1, "");
  status?: [boolean, string];
  private id: number = -1;

  constructor(private docSvc: DocumentsService,
    private validSvc: ValidationService,
    private usersSvc: UsersService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.docSvc.getJoinedDocument(this.id).subscribe({
      next: (merged) => {
        this.documentInfo = merged.info;
        
        if(merged.data)
          this.documentData = merged.data;
        
        if(merged.template)  
          this.template = merged.template;
        
        if (this.docSvc.checkDocumentData(this.documentData, this.template)){
          this.docSvc.updateJoinedDocument(this.documentData, this.documentInfo).subscribe();
        }
      },
      error: err =>  {
        this.router.navigate(['error'], { queryParams: {
          "title": `Не удалось загрузить документ '${this.documentInfo.name}'`, 
          "error": err.error
        }});
      }
    });
  }

  findField(index: number){
    return this.documentData.fields.find(d => d.id == index) 
  }

  findTable(index: number){
    return this.documentData.tables.find(d => d.id == index) 
  }

  validate(){
    let validated = true;
    let listner = this.validSvc.start().subscribe({
      complete: () => {
        validated = true;
        this.save();
      },
      error: () => {
        validated = false;
        this.status = [false, "Документ не сохранён, недопустимые значения"]
      }
    });
    return validated;
  }

  save(){
    this.docSvc.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
      error: error => this.status = [false, error.error],
      complete: () => this.status = [true, "Документ сохранён"]
    });
  }

  delete(){
    this.docSvc.deleteJoinedDocument(this.documentData.id).subscribe();
    this.router.navigate(["/documents"]);
  }

  nextType(){
    if (this.documentInfo.type != DocTypes.Old) {
      if (this.documentInfo.type == DocTypes.InWork) {
        this.validate();
      }
      else{
        this.documentInfo.type++;
        this.save();
      }
    }
  } 
}
