import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocTemplate, InputField, TemplateType, TableField } from '../models/template-row';
import { map } from 'rxjs';


@Injectable()
export class TemplatesService{

    private url = environment.apiUrl + "/templates";
    private typesUrl = environment.apiUrl + "/templates_types";
    
    constructor(private http: HttpClient){}
    
    getTypes(){
        return this.http.get<Array<TemplateType>>(this.typesUrl);
    }
    
    getTemplates(author?: string){
        return this.http.get<Array<DocTemplate>>(this.url);
    }
    
    getTemplateById(id: number){
        return this.http.get<DocTemplate>(`${this.url}/${id}`).pipe(
            map((t: any) => {
                t.fields = (JSON.parse(t.fields) as Array<InputField | TableField>);
                return t;
            }) 
        );
    }

    createTemplate(){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post<DocTemplate>(this.url, {}, {headers: myHeaders}); 
    }

    updateTemplate(template: DocTemplate) {
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.put<DocTemplate>(`${this.url}/${template.id}`, JSON.stringify(template), {headers:myHeaders});
    }

    deleteTemplate(id: number){
        return this.http.delete<DocTemplate>(`${this.url}/${id}`);
    }
}