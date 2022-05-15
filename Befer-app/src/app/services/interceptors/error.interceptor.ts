import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { notifyErr } from 'src/app/shared/other/notify';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          notifyErr(err.error.error);
          
          throw {
                message: err.error.error,
                code: err.error.code
            };
        }));
  }
}