import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addOwner } from '../auth/util';
import { IPost } from '../interfaces';
import { ApiService } from './api.service';
import { UserService } from './user.service';

export interface CreatePostDto {
  afterImgUrl: string,
  beforeImgUrl: string,
  description: string,
  title: string, 
  isPublic: boolean,
  owner: CreateOwnerDto
}

export interface CreateOwnerDto {
  __type: string,
  className: string,
  objectId: string,
  fullName: string,
  username: string,
  email: string
}


@Injectable()
export class PostService {

  postColl: string = '/classes/Publication';

  constructor(private api: ApiService, private userService: UserService) { }

  loadPosts(limit?: number): Observable<any> {
    return this.api.get(`${this.postColl}/${limit ? `?limit=${limit}` : ''}`);
  }

  loadPostById(id: string): Observable<any> {
    return this.api.get(`${this.postColl}/${id}?include=owner`);
  }

  createPost$(postData: CreatePostDto): Observable<IPost> {
    const userId = this.userService.currUser.objectId;

    addOwner(postData, userId);

    return this.api.post<IPost>(this.postColl, postData);
  }
}
