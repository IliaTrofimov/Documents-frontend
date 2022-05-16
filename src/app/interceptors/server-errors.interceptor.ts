import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../services/errors.service';
import { SiteError } from '../models/site-error';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private errorSvc: ErrorService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: any, caught: Observable<HttpEvent<any>>) => {
                if (err instanceof HttpErrorResponse && SiteError.isCritical(err.status)){
                    this.router.navigate(['error'], { queryParams: {
                        "status": this.errorSvc.catchServerError(err).Status, 
                    }});
                    return of();
                }
                else
                    return caught;
            }),
        );    
    }
}