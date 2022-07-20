import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';

import { User } from '../models/user';
import { AppConfig } from '../configurations/app.config';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


/** Сервис для работы с пользователями */
@Injectable()
export class UsersService{
    private url = "";
    
    constructor(private http: HttpClient, private configSvc: AppConfig, private alertSvc: AlertService){
        this.url = this.configSvc.apiUrl + "/users";
    }

    /** Возвращает количество элементов
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * position - Id должности
    */
    count(query?: { [param: string]: number|boolean }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }

    /** Возвращает список пользователей
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * position - Id должности
    * * permissions - права
    * * full (boolean) - если true, будет загружать дополнительные поля модели пользователя 
    */
    getUsers(query?: { [param: string]: number|boolean }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<User[]>(`${this.url}/list`, options);
    }
    
    getUser(cwid: string){
        return this.http.get<User>(`${this.url}/${cwid}/get`);
    }

    updateUser(user: User){
        return this.http.put<User>(`${this.url}/${user.CWID}/put`, user).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить пользователя", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    createUser(user: User){
        return this.http.post<string>(`${this.url}/post`, user).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    if (error.status == HttpStatusCode.Conflict)
                        this.alertSvc.error("Не удалось создать пользователя", "Данный CWID уже занят"); 
                    else
                        this.alertSvc.error("Не удалось создать пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteUser(cwid: string){
        return this.http.delete<number>(`${this.url}/${cwid}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить пользователя", {message: "Данные уже удалены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось удалить пользователя", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}