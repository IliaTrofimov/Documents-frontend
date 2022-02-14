import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTypes } from '../models/document-models';

import { DocTemplate } from "../models/template-models";
import { DocumentsService } from '../services/documents.service';
import { ValidationService } from '../services/validation.service';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService,]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1); 
  template: DocTemplate = new DocTemplate(-1, "");
  status?: string;
  validated: boolean = true;
  private id: number = -1;

  constructor(private docServ: DocumentsService,
    private validServ: ValidationService,
    private usersServ: UsersService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.docServ.getJoinedDocument(this.id).subscribe({
      next: (merged) => {
        this.documentInfo = merged.info;
        
        if(merged.data)
          this.documentData = merged.data;
        
        if(merged.template)  
          this.template = merged.template;
        
        console.log('comp.tables', this.documentData.tables);
        if (this.docServ.checkDocumentData(this.documentData, this.template)){
          console.log('comp.tables (checked)\n', this.documentData.tables);
          this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe();
        }
      }
    });
  }

  private getErrorPage(){
    this.router.navigate(['not-found'], { 
      queryParams: {
        "requestedId": this.id, 
        "requestedObject": "документ"
      } 
    });
  }

  findField(index: number){
    return this.documentData.fields.find(d => d.id == index) 
  }

  findTable(index: number){
    return this.documentData.tables.find(d => d.id == index) 
  }

  updateField(index: number, data: string|undefined){
    
  }

  validate(){
    // Сбрасываем validated, т.к. можно узнать только о провале валидации.
    this.validated = true;
    let listner = this.validServ.start().subscribe({
      complete: () => this.validated = false
    })
 
    // Ждём некоторое время окончания валидации
    new Promise(resolve => setTimeout(resolve, 200)).then(() => {
      this.save();
      listner.unsubscribe();
    })
  }

  save(){
    this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
      error: error => this.status = error,
      complete: () => this.status = "ok"
    });
  }

  delete(){
    this.docServ.deleteJoinedDocument(this.documentData.id).subscribe();
    this.router.navigate(["/documents"]);
  }

  nextType(){
    if(this.documentInfo.type != DocTypes.Old){
      this.documentInfo.type++;
      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
  } 
}
