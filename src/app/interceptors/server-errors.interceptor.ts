import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
        catchError((err: any, caught: Observable<HttpEvent<any>>) => {
            if (err instanceof HttpErrorResponse && err.status == 0){
                this.router.navigate(['error'], { queryParams: {
                    "status": -1, 
                }})
                return of();
            }
            else
                return caught;
        }));    
    }
}