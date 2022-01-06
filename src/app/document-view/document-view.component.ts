import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate } from '../models';
import { DocumentsDataService } from '../services/documents-data.service';
import { DocumentsInfoService } from '../services/documents-info.service';
import { TemplatesService } from '../services/templates.service';

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
    this.infoServ.getDocumentById(this.id).subscribe({
      next: data => this.documentInfo = data,
    });
    this.dataServ.getDocumentById(this.id).subscribe({
      next: data => this.documentData = data,
    });
    this.templateServ.getTemplateById(21).subscribe({
      next: data => this.template = data,
    });
  }

  save(){}
  delete(){}

}
