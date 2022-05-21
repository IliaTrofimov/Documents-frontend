import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../services/errors.service';
import { SiteError } from '../models/site-error';
import { AlertService } from '../services/alert.service';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private errorSvc: ErrorService, private alertSvc: AlertService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(() => this.errorSvc.clearError()),
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    if (SiteError.isCritical(error.status)){
                        console.log("critical server error:", error.message);
                        this.errorSvc.setServerError(error);
                        this.router.navigate(['error']);
                    }
                    else if (SiteError.isHandleable(error.status))
                        this.alertSvc.error("Необработанная ошибка (см. подробности)", {message: error.message + "\n" + JSON.stringify(error.error, null, 2)});
                }
                
                this.errorSvc.setServerError(error);
                console.log("server error:", error);
                return throwError(() => error)
            })
        )
      }
}