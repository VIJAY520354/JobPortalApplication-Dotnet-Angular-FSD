import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../Services/authorize.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authorizeService: AuthorizeService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add the JWT token to the request headers if it exists and is not expired
    const token = this.authorizeService.getToken();
    if (token && !this.authorizeService.isTokenExpired(token)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
