import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocumentData } from '../models';


@Injectable()
export class DocumentsDataService{
    private url = environment.apiUrl + "/documents_data";
    
    constructor(private http: HttpClient){}
    
    getDocuments(){
        return this.http.get<Array<DocumentData>>(this.url);
    }

    getDocumentById(id: number){
        return this.http.get<DocumentData>(`${this.url}/${id}`);
    }

    createDocument(infoId: number = -1){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post<DocumentData>(this.url, 
            JSON.stringify(new DocumentData(infoId, [])), 
            {headers: myHeaders}
        )
    }

    updateDocument(document: DocumentData) {
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.put<DocumentData>(`${this.url}/${document.id}`, JSON.stringify(document), {headers:myHeaders});
    }

    deleteDocument(id: number){
        return this.http.delete<DocumentData>(`${this.url}/${id}`);
    }

    createNewVersion(document: DocumentData){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        let newDoc = new DocumentData(0, document.data);
        return this.http.post<DocumentData>(this.url, 
            JSON.stringify(newDoc), 
            {headers: myHeaders}
        )
    }
}