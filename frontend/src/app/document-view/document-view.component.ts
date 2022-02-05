import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate, TableField, DocTypes } from '../models';
import { DocumentsService } from '../services/documents.service';
import { DocumentSavingService } from '../services/document-saving.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService, DocumentSavingService]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1, []); 
  template: DocTemplate = new DocTemplate(-1, "");
  status?: string;
  validated: boolean = true;
  saving: boolean = false;
  private id: number = -1;

  constructor(private docServ: DocumentsService,
    private savingServ: DocumentSavingService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.docServ.getJoinedDocument(this.id).subscribe({
      next: (merged) => {
        this.documentInfo = merged.info;
        this.documentData = merged.data;
        this.template = merged.template;
        this.initData();
      },
      error: (e) => this.getErrorPage()
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
    if(this.documentData.data == null || this.documentData.data.length < this.template.fields.length){
      for(let f of this.template.fields){
        if(f._class == "InputField")
          this.documentData.data.push("");
        else if(f._class == "TableField"){
          // инициализируем таблицы, чтобы в JSON не было null
          let templateTable = f as TableField;
          let temp = new Array<string[]>(templateTable.rows);
          
          for(let j = 0; j < templateTable.rows; j++){
            temp[j] = new Array<string>(templateTable.columns.length);
            for(let i = 0; i < templateTable.columns.length; i++)
              temp[j][i] = "";
          }

          this.documentData.data.push(temp);
        }
      }

      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe();
    }
  }

  updateField(index: number, data: string|undefined){
    if(data == undefined){
      this.validated = false;
    }
    else{
      this.validated = true;
      this.documentData.data[index] = data;
    }
  }

  updateTable(index: number, data: string|undefined){
    this.validated = data != undefined;
  }

  save(){
    this.savingServ.startSaving();

    if(this.validated){
      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
    else{
      this.status = "Недопустимые данные.";
    }
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
