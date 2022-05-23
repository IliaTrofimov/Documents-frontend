import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteError, SiteErrorCodes } from '../models/site-error';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private _lastError: SiteError = SiteError.Ok;  

    setServerError(error: HttpErrorResponse){
        return this._lastError = new SiteError(error.status, JSON.stringify(error.error, null, 2));
    }

    clearError(){
        this._lastError = SiteError.Ok; 
    }

    setWorngUrlError(url?: string){
        this._lastError = new SiteError(SiteErrorCodes.PageNotFound, url);
    }


    get lastError(){
        return this._lastError;
    }
}