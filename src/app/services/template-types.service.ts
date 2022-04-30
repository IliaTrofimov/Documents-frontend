import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TemplateType } from "../models/template-type";
import { AppConfig } from '../app.config';


@Injectable()
export class TemplateTypesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig){
        this.url = this.config.apiUrl + "/templatetypes";
    }
    
    getTypes(){
        return this.http.get<TemplateType[]>(`${this.url}/list`);
    }

    updateType(type: TemplateType) {
        return this.http.put(`${this.url}/${type.Id}/put`, type);
    }

    createType(name: string) {
        return this.http.post<number>(`${this.url}/post`, name);
    }

    deleteType(id: number){
        return this.http.delete(`${this.url}/${id}/delete`);
    }
}