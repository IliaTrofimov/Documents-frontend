import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocumentInfo, DocTypes, DocumentData, DocTemplate, InputField, TableField } from '../models';
import { map } from 'rxjs';


interface Merged{
    info: DocumentInfo;
    data: DocumentData;
    template?: DocTemplate;
}

@Injectable()
export class DocumentsService{
    private infoUrl = environment.apiUrl + "/documents";
    private dataUrl = environment.apiUrl + "/documents_data";
    private joinUrl = environment.apiUrl + "/document_joined";
    
    constructor(private http: HttpClient){}
    
    getInfos(type?: DocTypes){
       return this.http.get<DocumentInfo[]>(this.infoUrl);
    }

    getJoinedDocument(id: number){
        return this.http.get<Merged>(`${this.joinUrl}/${id}`).pipe(
            map((item: any) => {
                item.data.data = (JSON.parse(item.data.data) as Array<any>);
                item.template.fields = (JSON.parse(item.template.fields) as Array<InputField | TableField>);
                return item;
            }) 
        )
    }

    deleteJoinedDocument(id: number){
        return this.http.delete(`${this.joinUrl}/${id}`);
    }

    updateJoinedDocument(data: DocumentData, info: DocumentInfo){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        const body = {info: info, data: data};
        return this.http.put(`${this.joinUrl}/${info.id}`, JSON.stringify(body), {headers:myHeaders});
    }

    createJoinedDocument(templateId: number, previousVersionId?: number){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        const body = {templateId: templateId, previousVersionId: previousVersionId};
        return this.http.post<number>(this.joinUrl, JSON.stringify(body),  {headers: myHeaders});
    }
}