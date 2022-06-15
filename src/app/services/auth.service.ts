import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { User } from '../models/user';
import { AppConfig } from '../app.config';
import { catchError, of, tap, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';
import { UsersService } from './users.service';


@Injectable({providedIn: 'root'})
export class AuthService{
    private url = "";
    private currentUser?: User;
    
    constructor(private http: HttpClient, private configSvc: AppConfig, private alertSvc: AlertService, private usersSvc: UsersService){
        this.url = this.configSvc.apiUrl + "/users";
    }

    changeUser(id: number){
        return this.usersSvc.getUser(id).pipe(tap(user => this.currentUser = user));
    }

    getCurrent(){
        if (this.currentUser) 
            return of(this.currentUser);
        else 
            return this.http.get<User>(`${this.url}/whoami`).pipe(tap(user => 
                this.currentUser = user
            ));
    }
}