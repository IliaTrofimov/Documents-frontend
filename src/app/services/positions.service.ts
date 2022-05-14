import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Position } from "../models/position";
import { AppConfig } from '../app.config';


@Injectable()
export class PositionsService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig){
        this.url = this.config.apiUrl + "/positions";
    }
    
    getPositions(){
        return this.http.get<Position[]>(`${this.url}/list`);
    }

    updatePosition(pos: Position) {
        return this.http.put(`${this.url}/${pos.Id}/put`, pos);
    }

    createPosition(pos: Position) {
        return this.http.post<number>(`${this.url}/post`, pos);
    }

    deletePosition(id: number){
        return this.http.delete(`${this.url}/${id}/delete`);
    }
}