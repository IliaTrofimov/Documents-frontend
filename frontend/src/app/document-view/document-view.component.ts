import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate, TableField, DocTypes, InputField } from '../models';
import { DocumentsService } from '../services/documents.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1, []); 
  template: DocTemplate = new DocTemplate(-1, "");
  status?: string;
  private id: number = -1;

  constructor(private docServ: DocumentsService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
    this.initData();
  }

  private loadData(){
    this.docServ.getJoinedDocument(this.id).subscribe({
      next: (merged) => {
        this.documentInfo = merged.info;
        this.documentData = merged.data;
        this.template = merged.template;
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
          
          for(let j = 0; j < templateTable.rows; j++)
            temp[j] = new Array<string>(templateTable.columns.length);

          this.documentData.data.push(temp);
        }
      }

      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe();
    }
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

  validate(input: string, field: InputField){
    return true;
  } 
}
