import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsService]
})
export class DocumentsListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentsSvc: DocumentsService, private router: Router) { }

  ngOnInit(): void {
    this.documentsSvc.getDocuments().subscribe({
      next: data => this.documents = data,
      error: err => {
        //this.router.navigate(['error'], { queryParams: {
        //  "title": "Не удалось загрузить список документов", 
        //  "error": JSON.stringify(err.error, null, 2)
        //}});
      }
    });
  }
  
  removeDocument(id: number) {
    this.documentsSvc.deleteDocument(id).subscribe(() => 
      this.documents = this.documents.filter(doc => doc.Id !== id)
    );
  }

  createNewVersion(document: Document){
    
  }

}
