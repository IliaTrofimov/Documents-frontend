import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Sign } from '../models/sign';
import { UtilityService } from './utility.service';


@Injectable()
export class SignsService{
    private url = "";
    
    constructor(private http: HttpClient, private utilitySvc: UtilityService){
        this.url = this.utilitySvc.apiUrl + "/signs";
    }

    getSignsByUser(userId: number){
        return this.http.get<Sign[]>(`${this.url}/?userId=${userId}`);
    }

    getSignsByDocument(documentId: number){
        return this.http.get<Sign[]>(`${this.url}/?documentId=${documentId}`);
    }

    getSign(userId: number, documentId: number){
        return this.http.get<Sign[]>(`${this.url}/?documentId=${documentId}&userId=${userId}`);
    }

    updateSign(sign: Sign){
        return this.http.put(this.url,
            JSON.stringify(sign),
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    createSign(userId: number, documentId: number){
        const body = {userId: userId, documentId: documentId};
        return this.http.post<number>(this.url, 
            JSON.stringify(body), 
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    deleteSign(id: number){
        return this.http.delete(`${this.url}/${id}`);
    }
}