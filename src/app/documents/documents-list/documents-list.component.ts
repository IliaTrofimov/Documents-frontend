import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsService]
})
export class DocumentsListComponent implements OnInit {
  @Input() documents?: Document[];
  displayedColumns = ['Name', 'AuthorName', 'UpdateDate', 'ExpireDate', 'Status', 'Actions'];


  constructor(private documentsSvc: DocumentsService, private router: Router, private alertSvc: AlertService) { }

  ngOnInit(): void {
    this.documentsSvc.getDocuments().subscribe(data => {
      this.documents = data;
    });
  }
  
  removeDocument(id: number) {
    this.documentsSvc.deleteDocument(id).subscribe(() => {
      this.documents = this.documents?.filter(doc => doc.Id !== id);
      this.alertSvc.info("Документ удалён");
    });
  }

  createNewVersion(document: Document){
    
  }

}
