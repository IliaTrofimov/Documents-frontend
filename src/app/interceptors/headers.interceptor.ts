import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"


/** Добавление Content-Type и WithCredentials заголовков во все запросы */
@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method != "POST" && req.method != "PUT" || req.url.includes("print")) 
            return next.handle(req);
            
        if (req.headers.has("Content-Type")){
            const modified = req.clone({ withCredentials: true });
            return next.handle(modified);
        }
        else {
            const modified = req.clone({ 
                headers: req.headers.set("Content-Type", "application/json"),
                withCredentials: true,
            });
            return next.handle(modified);
        }
    }
}