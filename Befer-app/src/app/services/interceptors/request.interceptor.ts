import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from '../auth/user.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'X-Parse-Application-Id': environment.application['X-Parse-Application-Id'],
        'X-Parse-REST-API-Key': environment.application['X-Parse-REST-API-Key'],
      }
    });

    const token = this.userService.getToken;

    if (token) {
      req = req.clone({
        setHeaders: {
          'X-Parse-Session-Token': token
        }
      });
    }

    return next.handle(req);
  };
}
