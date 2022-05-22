import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Signatory } from '../models/signatory';
import { AppConfig } from '../app.config';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


@Injectable()
export class SignatoriesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig, private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/signs";
    }

    getSignsByUser(userId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?userId=${userId}`);
    }

    getSignsByDocument(documentId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?documentId=${documentId}`);
    }

    getSign(userId: number, documentId: number){
        return this.http.get<Signatory[]>(`${this.url}/get?documentId=${documentId}&userId=${userId}`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось найти подпись", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось найти подпись", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateSign(sign: Signatory){
        return this.http.put(`${this.url}/put`, JSON.stringify(sign)).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить подпись", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить подпись", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    createSign(userId: number, documentId: number){
        const body = {userId: userId, documentId: documentId};
        return this.http.post<number>(`${this.url}/post`, body).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось создать подпись", {message: "Документ или подписант не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось создать подпись", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteSign(id: number){
        return this.http.delete(`${this.url}/${id}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить подпись", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить подпись", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}