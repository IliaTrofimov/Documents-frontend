import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate, TableField, DocTypes, InputField } from '../models';
import { DocumentsDataService } from '../services/documents-data.service';
import { DocumentsInfoService } from '../services/documents-info.service';
import { TemplatesService } from '../services/templates.service';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [
    DocumentsDataService, 
    DocumentsInfoService, 
    TemplatesService, 
    ValidationService
  ]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1, []); 
  template: DocTemplate = new DocTemplate(-1, "");
  status?: string;
  private id: number = -1;

  constructor(private infoServ: DocumentsInfoService, 
    private dataServ: DocumentsDataService, 
    private templateServ: TemplatesService, 
    private validationServ: ValidationService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.infoServ.getDocumentById(this.id).subscribe({
      next: data => {
        this.documentInfo = data;
        
        this.templateServ.getTemplateById(data.templateId).subscribe({
          next: data => {
            this.template = data;
           
            this.dataServ.getDocumentById(this.id).subscribe({
              next: data => {
                this.documentData = data;
                this.initData();
              },
              error: () => this.getErrorPage()
            });
          },
          error: () => this.router.navigate(['not-found']) 
        }); 
      },
      error: () => this.getErrorPage()
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

  private initData(){
    if(this.documentData.data.length == 0){
      for(let f of this.template.fields){
        if(f._class == "InputField")
          this.documentData.data.push("");
        else if(f._class == "TableField"){
          // инициализируем таблицы, чтобы в JSON не было null
          let templateTable = f as TableField;
          let temp = new Array<string[]>(templateTable.rows);
          
          for(let j = 0; j < templateTable.columns.length; j++)
            temp[j] = new Array<string>(templateTable.columns.length);

          this.documentData.data.push(temp);
        }
      }

      this.dataServ.updateDocument(this.documentData).subscribe();
    }
  }

  save(){
    if(this.documentInfo && this.documentData){
      this.dataServ.updateDocument(this.documentData).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
      this.infoServ.updateDocument(this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
  }

  delete(){
    if(this.documentInfo && this.documentData){
      this.dataServ.deleteDocument(this.documentData.id).subscribe();
      this.infoServ.deleteDocument(this.documentInfo.id).subscribe();
      this.router.navigate(["/documents"]);
    }
  }

  nextType(){
    if(this.documentInfo.type != DocTypes.Old){
      this.documentInfo.type++;
      this.infoServ.updateDocument(this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
  }

  validate(input: string, field: InputField){
    return this.validationServ.checkInput(field, input);
  } 
}
