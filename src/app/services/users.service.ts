import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { User } from '../models/user';
import { AppConfig } from '../app.config';
import { catchError, of, tap, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


@Injectable()
export class UsersService{
    private url = "";
    private currentUser?: User;
    
    constructor(private http: HttpClient, private configSvc: AppConfig, private alertSvc: AlertService){
        this.url = this.configSvc.apiUrl + "/users";
    }

    count(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }

    getCurrent(){
        if (this.currentUser) 
            return of(this.currentUser);
        else 
            return this.http.get<User>(`${this.url}/whoami`).pipe(tap(user => 
                this.currentUser = user
            ));
        
    }

    getUsers(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<User[]>(`${this.url}/list`, options);
    }
    
    getUser(id: number){
        return this.http.get<User>(`${this.url}/${id}/get`);
    }

    updateUser(user: User){
        return this.http.put<User>(`${this.url}/${user.Id}/put`, user).pipe(
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
        return this.http.post<number>(`${this.url}/post`, user).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось создать пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteUser(id: number){
        return this.http.delete<number>(`${this.url}/${id}/delete`).pipe(
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