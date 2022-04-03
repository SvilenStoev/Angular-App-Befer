import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from './interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

  url = 'https://parseapi.back4app.com/classes/Publication';

  options = {
    headers: {
        'X-Parse-Application-Id': '7GJqF8la5Gzzpm7o4rAo5A0FeuTytgkwM3FK9iVP',
        'X-Parse-REST-API-Key': 'aMFFjTTsnCQrPPAZaK2FYHltL06o6bxQOC8Uk0wt'
    }
};

  loadPosts(): Observable<any> {
    return this.http.get<any>(this.url, this.options);
  }

}
