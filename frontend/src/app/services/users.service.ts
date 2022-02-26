import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, Signatory } from '../models/document-info';
import { map } from 'rxjs';


@Injectable({providedIn: 'root'})
export class UsersService{
    private usersUrl = environment.apiUrl + "/users";
    private signsUrl = environment.apiUrl + "/signs";
    
    constructor(private http: HttpClient){}
    
    getUser(id: number){
        return this.http.get<User>(`${this.usersUrl}/${id}`);
    }

    getSigners(documentId: number){
        return this.http.get<User[]>(`signers/${documentId}`);
    }

    
}