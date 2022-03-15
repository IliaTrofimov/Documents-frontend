import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Template } from '../models/template';
import { UtilityService } from './utility.service';


@Injectable()
export class TemplatesService{
    private url = "";
    
    constructor(private http: HttpClient, private utilitySvc: UtilityService){
        this.url = this.utilitySvc.apiUrl + "/templates";
    }
      
    getTemplates(author?: string){
        return this.http.get<Template[]>(this.url);
    }
    
    getTemplate(id: number){
        return this.http.get<Template>(`${this.url}/${id}`);
    }

    createTemplate(){
        return this.http.post<number>(this.url, 
            {authorId: this.utilitySvc.currentUserId}, 
            {headers: this.utilitySvc.httpHeaders}
        ); 
    }

    updateTemplate(template: Template) {
        return this.http.put(this.url, 
            JSON.stringify(template), 
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    deleteTemplate(id: number){
        return this.http.delete(`${this.url}/${id}`);
    }
}