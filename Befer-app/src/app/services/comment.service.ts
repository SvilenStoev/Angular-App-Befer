import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createPointer } from '../auth/util';
import { ApiService } from './api.service';
import { UserService } from './user.service';

export interface CreateCommentDto {
  content: string,
  author: CreateAuthorDto,
  post: CreatePostDto
}

export interface CreateAuthorDto {
  __type: string,
  className: string,
  objectId: string,
  fullName: string,
  username: string,
  email: string
}

export interface CreatePostDto {
  __type: string,
  className: string,
  objectId: string,
}

@Injectable()
export class CommentService {
  postColl: string = '/classes/Comment';

  constructor(private api: ApiService, private userService: UserService) { }

  loadPostComments$(limit: number, postId: string): Observable<any> {
    const pointerQuery = JSON.stringify({
      "publication": createPointer('Publication', postId)
    });

    return this.api.get(`${this.postColl}/?where=${pointerQuery}${limit ? `&limit=${limit}` : ''}&include=author`);
  }


  
  // loadPostById(id: string): Observable<any> {
  //   return this.api.get(`${this.postColl}/${id}?include=owner`);
  // }

  // createPost$(postData: CreatePostDto): Observable<IPost> {
  //   const userId = this.userService.userId;

  //   addOwner(postData, userId);

  //   return this.api
  //     .post<IPost>(this.postColl, postData)
  //     .pipe(
  //       map(response => response.body));
  // }

  // editPost$(postData: CreatePostDto, id: string): Observable<IPost> {
  //   return this.api
  //     .put<IPost>(`${this.postColl}/${id}`, postData)
  //     .pipe(
  //       map(response => response.body));
  // }

  // deletePost(id: string): Observable<any> {
  //   return this.api.delete(`${this.postColl}/${id}`);
  // }

  // updateLikesByPostId$(newLikesData: string[], postId: string): Observable<any> {
  //   const body = {
  //     "likes": newLikesData
  //   }

  //   return this.api
  //     .put<any>(`${this.postColl}/${postId}`, body)
  //     .pipe(
  //       map(response => response.body));
  // }
}
