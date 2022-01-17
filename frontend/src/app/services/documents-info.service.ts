import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocumentInfo, DocTypes, DocumentData, DocTemplate, InputField, TableField } from '../models';
import { map } from 'rxjs';

interface Merged{
    info: DocumentInfo;
    data: DocumentData;
    template: DocTemplate;
}

@Injectable()
export class DocumentsInfoService{
    private url = environment.apiUrl + "/documents";
    
    constructor(private http: HttpClient){}
    
    getDocuments(type?: DocTypes){
        if(!type){
            return this.http.get<Array<DocumentInfo>>(this.url);
        }
        else{
            return this.http.get<Array<DocumentInfo>>(this.url).pipe(
                map(docs => docs.filter(doc => doc.type == type))
            );
        }
    }

    getDocumentById(id: number){
        return this.http.get<DocumentInfo>(`${this.url}/${id}`);
    }

    getJoinedDocument(id: number){
        return this.http.get<Merged>(`${environment.apiUrl}/document-joined/${id}`).pipe(
            map((item: any) => {
                item.data.data = (JSON.parse(item.data.data) as Array<any>);
                item.template.fields = (JSON.parse(item.template.fields) as Array<InputField | TableField>);
                return item;
            })
        );
    }

    createDocument(templateId: number){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post<DocumentInfo>(this.url, 
            JSON.stringify(new DocumentInfo(0, "Новый документ", templateId)), 
            {headers: myHeaders}
        ); 
    }

    updateDocument(document: DocumentInfo) {
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.put<DocumentInfo>(`${this.url}/${document.id}`, JSON.stringify(document), {headers:myHeaders});
    }

    deleteDocument(id: number){
        return this.http.delete<DocumentInfo>(`${this.url}/${id}`);
    }

    createNewVersion(document: DocumentInfo){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        let newDoc = new DocumentInfo(0, document.name + '*', document.templateId, document.registryId, 
            document.author, DocTypes.InWork, document.id);
        return this.http.post<DocumentInfo>(this.url, 
            JSON.stringify(newDoc), 
            {headers: myHeaders}
        ); 
    }
}