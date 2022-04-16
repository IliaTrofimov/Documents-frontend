import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Template } from '../models/template';
import { AppConfig } from '../app.config';
import { TemplateTable } from '../models/template-table';
import { TemplateField } from '../models/template-field';


@Injectable()
export class TemplatesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig){
        this.url = this.config.apiUrl + "/templates";
    }
      
    getTemplates(author?: string){
        return this.http.get<Template[]>(`${this.url}/list`);
    }
    
    getTemplate(id: number){
        return this.http.get<Template>(`${this.url}/${id}/get`);
    }

    createTemplate(){
        return this.http.post<number>(`${this.url}/post`, {authorId: 0}); 
    }

    updateTemplate(template: Template) {
        return this.http.put<Template>(`${this.url}/${template.Id}/put`, template);
    }

    updateTable(templateId: number, table: TemplateTable) {
        return this.http.put<TemplateTable>(`${this.url}/${templateId}/put-table`, table);
    }

    updateField(templateId: number, field: TemplateField) {
        return this.http.put<TemplateField>(`${this.url}/${templateId}/put-field`, field);
    }

    deleteTable(templateId: number, tableId: number) {
        return this.http.delete(`${this.url}/${templateId}/delete-table/${tableId}`);
    }

    deleteField(templateId: number, fieldId: number) {
        return this.http.delete(`${this.url}/${templateId}/delete-field/${fieldId}`);
    }

    deleteTemplate(id: number){
        return this.http.delete(`${this.url}/${id}/delete`);
    }
}