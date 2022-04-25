import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { addOwner, createPointer } from '../auth/util';
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
    const onlyPublic = JSON.stringify({
      isPublic: true
    });

    return this.api.get(`${this.postColl}/?where=${onlyPublic}&order=-createdAt${limit ? `&limit=${limit}` : ''}`);
  }

  loadMyPosts(limit: number, userId: string): Observable<any> {
    const pointerQuery = JSON.stringify({
      "owner": createPointer('_User', userId)
    });

    return this.api.get(`${this.postColl}/?where=${pointerQuery}${limit ? `&limit=${limit}` : ''}`);
  }

  loadPostById(id: string): Observable<any> {
    return this.api.get(`${this.postColl}/${id}?include=owner`);
  }

  createPost$(postData: CreatePostDto): Observable<IPost> {
    const userId = this.userService.userId;

    addOwner(postData, userId);

    return this.api
      .post<IPost>(this.postColl, postData)
      .pipe(
        map(response => response.body));
  }

  editPost$(postData: CreatePostDto, id: string): Observable<IPost> {
    return this.api
      .put<IPost>(`${this.postColl}/${id}`, postData)
      .pipe(
        map(response => response.body));
  }

  deletePost(id: string): Observable<any> {
    return this.api.delete(`${this.postColl}/${id}`);
  }

  updateLikesByPostId$(newLikesData: string[], postId: string): Observable<any> {
    const body = {
      "likes": newLikesData
    }

    console.log(body);

    return this.api
      .put<any>(`${this.postColl}/${postId}`, body)
      .pipe(
        map(response => response.body));
  }
}

