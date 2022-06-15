import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../models/user';
import { AppConfig } from '../app.config';
import { catchError, of, tap, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private url = "";
    private currentUser?: User;
    
    constructor(private http: HttpClient, 
        private configSvc: AppConfig,
        private alertSvc: AlertService){
        this.url = this.configSvc.apiUrl + "/users";
    }

    changeUser(id: number){
        return this.http.get<User>(`${this.url}/${id}/get`)
            .pipe(tap(user => this.currentUser = user))
            .pipe(catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось сменить пользователя", {message: "Пользователь с таким Id не существует."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось сменить пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            }));
    }

    current(){
        if (this.currentUser) 
            return of(this.currentUser);
        else 
            return this.http.get<User>(`${this.url}/whoami`).pipe(tap(user => 
                this.currentUser = user
            ));
    }
}