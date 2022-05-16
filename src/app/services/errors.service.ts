import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteError, SiteErrorCodes } from '../models/site-error';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private _lastError: SiteError = new SiteError(SiteErrorCodes.Ok);  

    getClientMessage(error: Error): string {
        if (!navigator.onLine) {
            return 'No Internet Connection';
        }
        return error.message ? error.message : error.toString();
    }

    catchServerError(error: HttpErrorResponse){
        if (error.status == 0)
            return this._lastError = new SiteError(SiteErrorCodes.NoConnection)
        else{
            return this._lastError = new SiteError(error.status, JSON.stringify(error.error, null, 2));
        }
    }

    get lastError(){
        return this._lastError;
    }
}