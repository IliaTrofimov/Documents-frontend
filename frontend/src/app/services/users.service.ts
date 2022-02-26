import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { User, Signatory } from '../models/user';


@Injectable({providedIn: 'root'})
export class UsersService{
    private usersUrl = environment.apiUrl + "/users";
    private signsUrl = environment.apiUrl + "/signs";
    
    constructor(private http: HttpClient){}
    
    whoami(){
        return "unknown user";
    }

    getUser(id: number){
        return this.http.get<User>(`${this.usersUrl}/${id}`);
    }

    getSigners(documentId: number){
        return this.http.get<User[]>(`signers/${documentId}`);
    }

}