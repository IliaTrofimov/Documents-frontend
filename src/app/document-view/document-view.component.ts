import { delay, switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate } from '../models';
import { DocumentsDataService } from '../services/documents-data.service';
import { DocumentsInfoService } from '../services/documents-info.service';
import { TemplatesService } from '../services/templates.service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsDataService, DocumentsInfoService, TemplatesService]
})
export class DocumentViewComponent implements OnInit {
  documentInfo?: DocumentInfo;
  documentData?: DocumentData; 
  template?: DocTemplate;
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
        if(data){
          this.templateServ.getTemplateById(data.templateId).subscribe({
            next: data => this.template = data,
          });
        }  
      }
    }); 
    this.dataServ.getDocumentById(this.id).subscribe({
      next: data => this.documentData = data,
    });
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

}
