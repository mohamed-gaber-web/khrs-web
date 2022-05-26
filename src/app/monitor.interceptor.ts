import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Injectable()
    
export class MonitorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const begin = performance.now();

        return next.handle(req).pipe(
            finalize(() => {
                this.logRequestTime(begin, req.url, req.method)
            })
        )   
    }
    private logRequestTime(startTime: number, url: string, method: string) {
        const requestDuration = `${performance.now() - startTime}`;
        console.log(`HTTP ${method} ${url} - ${requestDuration} milliseconds`);
    }
 }