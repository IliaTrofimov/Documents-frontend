import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentInfo } from '../models';
import { DocumentsInfoService } from '../services/documents-info.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsInfoService]
})
export class DocumentsListComponent implements OnInit {
  documents: DocumentInfo[] = [];

  constructor(private documentsServ: DocumentsInfoService, private router: Router) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.documentsServ.getDocuments().subscribe((data: DocumentInfo[]) => this.documents = data);
  }
  
  addDocument() {
    this.documentsServ.createDocument(-1).subscribe((t: DocumentInfo) => 
      this.router.navigate(["documents/" + t.id])
    );
  }

  removeDocument(id: number) {
    this.documentsServ.deleteDocument(id).subscribe((_) => {
        this.documents = this.documents.filter((t) => t.id !== id);
      }
    );
  }

}
