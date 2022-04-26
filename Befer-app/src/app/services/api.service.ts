import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  hostname: string = environment.application.hostname;

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(this.hostname + url);
  }

  post<T>(url: string, body: any = {}): Observable<any> {
    return this.http.post<T>(this.hostname + url, body, { observe: 'response' });
  }

  put<T>(url: string, body: any = {}): Observable<any> {
    return this.http.put<T>(this.hostname + url, body, { observe: 'response' });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.hostname + url);
  }
}
