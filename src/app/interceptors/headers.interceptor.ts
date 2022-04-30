import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modified = req.clone({ 
            headers: req.headers.set("Content-Type", "application/json"),
            withCredentials: true,
        });
        return next.handle(modified);
    }
}