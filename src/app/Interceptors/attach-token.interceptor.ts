import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';


@Injectable()
export class AttachTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const urlList = [`${environment.baseUrl}/api/departments`];

    if(request.method == 'GET' && urlList.includes(request.url)){
      return next.handle(request);
    }
    
    let token = localStorage.getItem(environment.tokenName);

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    return next.handle(request); 
  }
}
