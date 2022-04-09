import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class PostService {

  postColl: string = '/classes/Publication';

  constructor(private api: ApiService) { }

  loadPosts(limit?: number): Observable<any> {
    return this.api.get(`${this.postColl}/${limit ? `?limit=${limit}` : ''}`);
  }

  loadPostById(id: string): Observable<any> {
    return this.api.get(`${this.postColl}/${id}?include=owner`);
  }
}
