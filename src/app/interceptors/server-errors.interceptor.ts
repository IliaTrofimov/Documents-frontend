import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SiteErrorCodes } from '../models/site-error';
import { ErrorService } from '../services/errors.service';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private errorSvc: ErrorService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: any, caught: Observable<HttpEvent<any>>) => {
                if (err instanceof HttpErrorResponse){
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