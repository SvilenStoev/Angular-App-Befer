import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../interfaces';
import { UserService } from './user.service';

@Injectable()
export class ApiService {

  hostname: string = environment.application.hostname;

  options = {
    headers: environment.application.apiConfigHeaders
  }

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(this.hostname + url, this.options);
  }

  post<T>(url: string, data: any): Observable<any> {
    return this.http.post<T>(this.hostname + url, data, { headers: environment.application.apiConfigHeaders, observe: 'response' });
  }
}
