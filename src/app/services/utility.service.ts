import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';


@Injectable({providedIn: 'root'})
export class UtilityService{
    private _httpHeaders: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");
    private _apiUrl = 'https://localhost:44381/api';
    private _currentUser?: User;

    constructor(private http: HttpClient){
        this.http.get<User>(this._apiUrl + "/whoami").subscribe((user) => this._currentUser = user);
    }

    get httpHeaders(){
        return this._httpHeaders;
    }

    getCurrentUser(){
        this.http.get<User>(this._apiUrl + "/whoami").subscribe((user) => this._currentUser = user);
        return this._currentUser;
    }

    get currentUserId(){
        return this._currentUser ? this._currentUser.Id : -1;
    }

    get apiUrl(){
        return this._apiUrl;
    }
}