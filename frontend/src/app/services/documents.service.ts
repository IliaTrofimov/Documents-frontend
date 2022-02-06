import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocumentInfo, 
    DocTypes, 
    DocumentData, 
    DocTemplate, 
    InputField, 
    TableField, 
    User,
    Signatory,
    Merged
} from '../models/data-models';
import { map } from 'rxjs';
import { UsersService } from './users.service';


@Injectable()
export class DocumentsService{
    private infoUrl = environment.apiUrl + "/documents";
    private dataUrl = environment.apiUrl + "/documents_data";
    private joinUrl = environment.apiUrl + "/document_joined";
    
    constructor(private http: HttpClient, private usersServ: UsersService){}
    
    getInfos(type?: DocTypes){
        return this.http.get<any[]>(this.infoUrl).pipe(map(items => {
            return items.map(info => {
                info = {info: info, user: null}
                this.usersServ.getUser(info.info.author).subscribe({
                    next: user => info.user = user,
                    error: err => info.user = new User(-1, "неизвестно")
                });
                return info;
            })
        }));
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