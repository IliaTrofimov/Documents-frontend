import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocTemplate } from '../models';
import { map } from 'rxjs';


@Injectable()
export class TemplatesService{
     
    private url = environment.apiUrl + "/templates";
    private typesUrl = environment.apiUrl + "/templates_types";
    
    constructor(private http: HttpClient){}
    
    getTypes(){
        return this.http.get<Array<[number, string]>>(this.typesUrl);
    }
    
    getTemplates(author?: string){
        if(!author){
            return this.http.get<Array<DocTemplate>>(this.url);
        }
        else{
            return this.http.get<Array<DocTemplate>>(this.url).pipe(
                map(templates => templates.filter(t => t.author == author))
            );
        }
    }
    
    getTemplateById(id: number){
        return this.http.get<DocTemplate>(`${this.url}/${id}`);
    }

    createTemplate(){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        let newTemp = new DocTemplate(0, "Новый шаблон");
        return this.http.post<DocTemplate>(this.url, JSON.stringify(newTemp), {headers: myHeaders}); 
    }

    updateTemplate(template: DocTemplate) {
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.put<DocTemplate>(`${this.url}/${template.id}`, JSON.stringify(template), {headers:myHeaders});
    }

    deleteTemplate(id: number){
        return this.http.delete<DocTemplate>(`${this.url}/${id}`);
    }
}