import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate, TableField } from '../models';
import { DocumentsDataService } from '../services/documents-data.service';
import { DocumentsInfoService } from '../services/documents-info.service';
import { TemplatesService } from '../services/templates.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsDataService, DocumentsInfoService, TemplatesService]
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
          next: data => this.template = data,
          error: () => this.router.navigate(['not-found']) 
        }); 
      },
      error: () => this.getErrorPage()
    }); 
    this.dataServ.getDocumentById(this.id).subscribe({
      next: data => {
        this.documentData = data;
        this.initData();
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
        }
      }
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

  getTableSlice(index: number){
    let table = this.template.fields[index] as TableField;
    if(table._class == "TableField")
      return this.documentData.data.slice(index, index + table.rows * table.columns.length)
    return []
  }

  updateTable(data: string[][], index: number){
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].length; j++)
        this.documentData.data[index + i*data.length + j];
    }
  }
}
