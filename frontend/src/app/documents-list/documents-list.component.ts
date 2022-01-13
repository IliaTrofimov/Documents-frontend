import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentInfo } from '../models';
import { DocumentsInfoService } from '../services/documents-info.service';
import { DocumentsDataService } from '../services/documents-data.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsInfoService, DocumentsDataService]
})
export class DocumentsListComponent implements OnInit {
  documents: DocumentInfo[] = [];

  constructor(private infoServ: DocumentsInfoService, 
    private dataServ: DocumentsDataService, 
    private router: Router) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.infoServ.getDocuments().subscribe((data: DocumentInfo[]) => this.documents = data);
  }
  
  addDocument() {
    this.infoServ.createDocument(-1).subscribe((t: DocumentInfo) => 
      this.router.navigate(["documents/" + t.id])
    );
  }

  removeDocument(id: number) {
    this.infoServ.deleteDocument(id).subscribe((_) => {
        this.documents = this.documents.filter((t) => t.id !== id);
        this.dataServ.deleteDocument(id).subscribe();
      }
    );
  }

  createNewVersion(document: DocumentInfo){
    this.infoServ.createNewVersion(document).subscribe({
      next: info => {
        this.dataServ.getDocumentById(document.id).subscribe({
          next: data => {
            this.dataServ.createDocument(info.id, data.data).subscribe(() => 
              this.router.navigate(['documents/' + info.id])
            );
          }
        })
      } 
    });
  }

}
