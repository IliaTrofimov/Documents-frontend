
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorService } from './services/errors.service';
import { AlertService } from './services/alert.service';
import { SiteError } from './models/site-error';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private errorSvc: ErrorService, 
        private alertSvc: AlertService,
        private router: Router) { }

    handleError(error: Error | HttpErrorResponse) {
        if (error instanceof HttpErrorResponse) {
            console.error("server error: ", error.error);
            this.alertSvc.error(error.message);
        } else {
            console.error("client error: ", error);
            this.alertSvc.error(error.message)
        }
    }
}