import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Position } from "../models/position";
import { AppConfig } from '../configurations/app.config';
import { SiteErrorCodes } from '../models/site-error';
import { catchError, throwError } from 'rxjs';
import { AlertService } from './alert.service';


/** Сервис для работы с должностями */
@Injectable()
export class PositionsService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig, private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/positions";
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
    

    /** Возвращает список должностей
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    */
    getPositions(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<Position[]>(`${this.url}/list`, options);
    }

    updatePosition(pos: Position) {
        return this.http.put(`${this.url}/${pos.Id}/put`, pos).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить должность", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить должность", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    createPosition(pos: Position) {
        return this.http.post<number>(`${this.url}/post`, pos).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось создать должность", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deletePosition(id: number){
        return this.http.delete(`${this.url}/${id}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить должность", {message: "Данные уже удалены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось удалить должность", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить должность", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}