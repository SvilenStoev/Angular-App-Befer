import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { addOwner, createPointer } from '../auth/util';
import { IComment } from '../interfaces';
import { ApiService } from './api.service';
import { UserService } from './user.service';

export interface CreateCommentDto {
  content: string,
  author: CreateAuthorDto,
  publication: CreatePostDto
}

export interface CreateAuthorDto {
  __type: string,
  className: string,
  objectId: string,

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

    return this.api.get(`${this.postColl}/?where=${pointerQuery}${limit ? `&limit=${limit}` : ''}&include=author&order=-createdAt`);
  }

  createComment$(commentData: CreateCommentDto, postId: string): Observable<IComment> {
    const userId = this.userService.userId;

    if (!userId || !postId) {
      throw new Error('Something went wrong!');
    }

    commentData.author = createPointer('_User', userId);
    commentData.publication = createPointer('Publication', postId);

    return this.api
      .post<IComment>(this.postColl, commentData)
      .pipe(
        map(response => response.body));
  }

  deleteComment$(id: string): Observable<any> {
    return this.api.delete(`${this.postColl}/${id}`);
  }
}
