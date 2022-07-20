import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { TemplateType } from "../models/template-type";
import { AppConfig } from '../configurations/app.config';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


/** Сервис для работы с типами шаблонов */
@Injectable()
export class TemplateTypesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig, private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/templatetypes";
    }

    /** Возвращает число элементов
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    */
    count(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }
    
    /** Возвращает список типов
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    */
    getTypes(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<TemplateType[]>(`${this.url}/list`, options);
    }

    updateType(type: TemplateType) {
        return this.http.put(`${this.url}/${type.Id}/put`, type).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить тип", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить тип", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    createType(type: TemplateType) {
        return this.http.post<number>(`${this.url}/post`, type).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось создать тип", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteType(id: number){
        return this.http.delete(`${this.url}/${id}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить тип", {message: "Данные уже удалены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось удалить тип", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить тип", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}