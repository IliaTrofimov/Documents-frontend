import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

import { User } from '../models/user';
import { AppConfig } from '../configurations/app.config';
import { AlertService } from './alert.service';


/** Сервис для авторизации */
@Injectable({providedIn: 'root'})
export class AuthService{
    private url = "";
    
    constructor(private http: HttpClient, private configSvc: AppConfig, private alertSvc: AlertService){
        this.url = this.configSvc.apiUrl + "/users";
    }

    /** Авторизация */
    whoami(){
        return this.http.get<User>(`${this.url}/whoami`).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось установить пользователя", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        );
    }

}