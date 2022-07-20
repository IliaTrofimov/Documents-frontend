import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Signatory } from '../models/signatory';
import { AppConfig } from '../configurations/app.config';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


/** Сервис для работы с подписями */
@Injectable()
export class SignatoriesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig, private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/signs";
    }

    
    /** Возвращает список пользователей
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * documentId - Id докуметна  (-1 без фильтра)
    * * userId - (string) CWID подписанта  (undefined без фильтра)
    * * initiatorId - (string) CWID инициатора (undefined без фильтра)
    * * showOld (bool) - выводить уже рассмотренные подписи
    * * showUnassigned (bool) - выводить подписи, для которых не назначен подписант 
    */
    count(query?: { [param: string]: any }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }

    /** Возвращает список подписей
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * documentId - Id докуметна  (-1 без фильтра)
    * * userId - (string) CWID подписанта  (undefined без фильтра)
    * * initiatorId - (string) CWID инициатора (undefined без фильтра)
    * * showOld (bool) - выводить уже рассмотренные подписи
    * * showUnassigned (bool) - выводить подписи, для которых не назначен подписант 
    */
    getSigns(query?: { [param: string]: any }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<Signatory[]>(`${this.url}/list`, options).pipe(
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

    getSign(id: number){
        return this.http.get<Signatory[]>(`${this.url}/${id}/get`).pipe(
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
        const body = {userCWID: sign.UserCWID, signed: sign.Signed, documentId: sign.DocumentId};
        return this.http.put<Signatory>(`${this.url}/${sign.Id}/put`, body).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        //case SiteErrorCodes.NotFound: 
                        //    this.alertSvc.error("Не удалось изменить подпись", {message: "Данные не найдены."}); 
                        //    break;
                        default: 
                            this.alertSvc.error("Не удалось изменить подпись", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    notify(sign: Signatory){
        return this.http.put(`${this.url}/${sign.Id}/notify`, {}).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось создать уведомление", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    createSign(userId: string, documentId: number, initiatorId: string, positionId: number){
        const body = {userCWID: userId, documentId: documentId, initiatorCWID: initiatorId, signerPositionId: positionId};
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