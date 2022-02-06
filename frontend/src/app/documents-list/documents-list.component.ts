import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentInfo, Merged } from '../models/data-models';
import { DocumentsService } from '../services/documents.service';


@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  providers: [DocumentsService]
})
export class DocumentsListComponent implements OnInit {
  documents: Merged[] = [];

  constructor(private docServ: DocumentsService, private router: Router) { }

  ngOnInit(): void {
    this.docServ.getInfos().subscribe((data) => this.documents = data);
  }
  
  removeDocument(id: number) {
    this.docServ.deleteJoinedDocument(id).subscribe((_) => 
      this.documents = this.documents.filter((t) => t.info.id !== id)
    );
  }

  createNewVersion(document: DocumentInfo){
    this.docServ.createJoinedDocument(document.templateId, document.id).subscribe(id =>
      this.router.navigate(['/documents', id])
    );
  }

}
