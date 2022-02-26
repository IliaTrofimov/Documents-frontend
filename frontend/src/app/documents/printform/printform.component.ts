import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { DocTemplate } from '../../models/template';
import { DocumentInfo } from '../../models/document-info';
import { DocumentData } from 'src/app/models/document-data';
import { UsersService } from '../../services/users.service';
import { DocumentsService } from '../../services/documents.service';


declare  var jQuery:  any;

@Component({
  selector: 'app-printform',
  templateUrl: './printform.component.html',
  styleUrls: ['./printform.component.css'],
  providers: [DocumentsService]
})
export class PrintformComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1); 
  template: DocTemplate = new DocTemplate(-1, "");
  private id: number = -1;

  constructor(private docSvc: DocumentsService,
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
      },
      error: err =>  {
        this.router.navigate(['not-found'], { queryParams: {
          "title": `Не удалось загрузить документ '${this.documentInfo.name}'`, 
          "error": err.error
        }});
      }
    });
  }

  print(){
    let element = document.getElementById("payload");
    console.log("elem:", element)
    if (element){
      (function ($) {
        window.print();
      })(jQuery);
    }
  }

  findField(index: number){
    return this.documentData.fields.find(d => d.id == index)?.value;
  }

  findTable(index: number){
    return this.documentData.tables.find(d => d.id == index) 
  }
}

