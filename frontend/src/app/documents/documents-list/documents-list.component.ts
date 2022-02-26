import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentInfo } from '../../models/document-models';
import { DocumentsService } from '../../services/documents.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsService]
})
export class DocumentsListComponent implements OnInit {
  documents: DocumentInfo[] = [];

  constructor(private docSvc: DocumentsService, private router: Router) { }

  ngOnInit(): void {
    this.docSvc.getInfos().subscribe({
      next: data => this.documents = data,
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": "Не удалось загрузить список документов", 
          "error": err.error
        }});
      }
    });
  }
  
  removeDocument(id: number) {
    this.docSvc.deleteJoinedDocument(id).subscribe((_) => 
      this.documents = this.documents.filter((t) => t.id !== id)
    );
  }

  createNewVersion(document: DocumentInfo){
    this.docSvc.createJoinedDocument(document.templateId, document.id).subscribe(id =>
      this.router.navigate(['/documents', id])
    );
  }

}
