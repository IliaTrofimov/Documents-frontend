import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Document, DocumentStatus } from '../models/document';
import { UtilityService } from './utility.service';


@Injectable()
export class DocumentsService{
    private url = "";
    
    constructor(private http: HttpClient, private utilitySvc: UtilityService){
        this.url = this.utilitySvc.apiUrl + "/documents";
    }
    

    getDocuments(type?: DocumentStatus){
        return this.http.get<Document[]>(this.url);
    }

    getDocument(id: number){
        return this.http.get<Document>(`${this.url}/${id}`);
    }

    updateDocument(document: Document){
        return this.http.put(this.url, 
            JSON.stringify(document), 
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    createDocument(templateId: number, previousVersionId?: number){
        const body = {
            templateId: templateId,
            userId: this.utilitySvc.currentUserId,
            previousVersionId: previousVersionId
        };
        return this.http.post<number>(this.url,
            JSON.stringify(body),
            {headers: this.utilitySvc.httpHeaders
        });
    }

    deleteDocument(id: number){
        return this.http.delete(`${this.url}/${id}`);
    }
}