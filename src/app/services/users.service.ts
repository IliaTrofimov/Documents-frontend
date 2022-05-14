import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { AppConfig } from '../app.config';


@Injectable()
export class UsersService{
    private url = "";
    
    constructor(private http: HttpClient, private configSvc: AppConfig){
        this.url = this.configSvc.apiUrl + "/users";
    }

    getCurrent(){
        return this.http.get<User>(`${this.url}/whoami`);
    }

    getUsers(){
        return this.http.get<User[]>(`${this.url}/list`);
    }
    
    getUser(id: number){
        return this.http.get<User>(`${this.url}/${id}/get`);
    }

    updateUser(user: User){
        return this.http.put<User>(`${this.url}/${user.Id}/put`, user);
    }

    createUser(user: User){
        return this.http.post<number>(`${this.url}/post`, user);
    }

    deleteUser(id: number){
        return this.http.delete<number>(`${this.url}/${id}/delete`);
    }
}