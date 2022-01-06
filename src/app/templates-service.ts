import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DocTemplate } from './models';


@Injectable()
export class TemplatesService{
     
    private url = environment.apiUrl + "/templates";
    private typesUrl = environment.apiUrl + "/types";
    
    constructor(private http: HttpClient){ console.log(`api url: ${this.url}`) }
    
    getTypes(){
        return this.http.get<Array<string>>(this.typesUrl);
    }
    
    getTemplates(){
        return this.http.get<Array<DocTemplate>>(this.url);
    }
    getTemplateById(id: number){
        //return this.getTemplates().pipe(
        //    map(data => data.find(template => template.id === id))
        //);
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