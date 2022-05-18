import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteError, SiteErrorCodes } from '../models/site-error';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private _lastError: SiteError = SiteError.Ok;  

    getClientMessage(error: Error): string {
        if (!navigator.onLine) {
            return 'No Internet Connection';
        }
        return error.message ? error.message : error.toString();
    }

    setServerError(error: HttpErrorResponse){
        return this._lastError = new SiteError(error.status, JSON.stringify(error.error, null, 2));
    }

    clearError(){
        this._lastError = SiteError.Ok; 
    }



    get lastError(){
        return this._lastError;
    }
}