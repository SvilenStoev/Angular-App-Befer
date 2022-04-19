import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUser } from '../interfaces';

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

  post<T>(url: string, data: any) {
    return this.http.post<T>(this.hostname + url, data, this.options);
  }
}
