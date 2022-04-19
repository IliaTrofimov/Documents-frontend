import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Signatory } from '../models/signatory';
import { AppConfig } from '../app.config';


@Injectable()
export class SignatoriesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig){
        this.url = this.config.apiUrl + "/signs";
    }

    getSignsByUser(userId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?userId=${userId}`);
    }

    getSignsByDocument(documentId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?documentId=${documentId}`);
    }

    getSign(userId: number, documentId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?documentId=${documentId}&userId=${userId}`);
    }

    updateSign(sign: Signatory){
        return this.http.put(`${this.url}/put`, JSON.stringify(sign));
    }

    createSign(userId: number, documentId: number){
        const body = {userId: userId, documentId: documentId};
        return this.http.post<number>(`${this.url}/post`, body);
    }

    deleteSign(id: number){
        return this.http.delete(`${this.url}/${id}/delete`);
    }
}