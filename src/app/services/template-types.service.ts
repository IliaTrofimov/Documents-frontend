import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TemplateType } from "../models/template-type";
import { UtilityService } from './utility.service';


@Injectable()
export class TemplateTypesService{
    private url = "";
    
    constructor(private http: HttpClient, private utilitySvc: UtilityService){
        this.url = this.utilitySvc.apiUrl + "/templatetypes/";
    }
    
    getTypes(){
        return this.http.get<TemplateType[]>(this.url);
    }

    updateType(type: TemplateType) {
        return this.http.put(`${this.url}`, 
            JSON.stringify(type), 
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    createType(name: string) {
        return this.http.post<number>(`${this.url}`, 
            {name: name}, 
            {headers:this.utilitySvc.httpHeaders}
        );
    }

    deleteType(id: number){
        return this.http.delete(`${this.url}/${id}`);
    }
}