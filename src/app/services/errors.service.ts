import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    getClientMessage(error: Error): string {
        if (!navigator.onLine) {
            return 'No Internet Connection';
        }
        return error.message ? error.message : error.toString();
    }

    getClientStack(error: Error) {
        return error.stack ? error.stack : "";
    }

    getServerMessage(error: HttpErrorResponse) {
        return error.message;
    }

    getServerStack(error: HttpErrorResponse) {
        return 'stack';
    }
}