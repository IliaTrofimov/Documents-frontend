import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { UtilityService } from './utility.service';


@Injectable()
export class UsersService{
    private url = "";
    
    constructor(private http: HttpClient, private utilitySvc: UtilityService){
        this.url = this.utilitySvc.apiUrl + "/users";
    }

    getUsers(){
        return this.http.get<User[]>(this.url);
    }
    
    getUser(id: number){
        return this.http.get<User>(`${this.url}/${id}`);
    }

    updateUser(user: User){
        return this.http.put(this.url,
            JSON.stringify(user),
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    createUser(user: User){
        return this.http.post<number>(this.url,
            JSON.stringify(user),
            {headers: this.utilitySvc.httpHeaders}
        );
    }

    deleteUser(id: number){
        return this.http.delete<number>(`${this.url}/${id}`);
    }
}