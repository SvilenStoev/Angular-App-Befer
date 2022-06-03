import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { IPost } from '../../interfaces';
import { ApiService } from '../api.service';
import { UserService } from '../auth/user.service';
import { addOwner, createPointer } from '../../auth/util';
import { LanguageService } from '../common/language.service';

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
  menuPostsHome: any = this.langService.get().postsHome;
  onlyPublic: string = JSON.stringify({
    isPublic: true
  });

  constructor(
    private api: ApiService,
    private userService: UserService,
    private langService: LanguageService) { }

  getAllPostsCount$(): Observable<any> {
    return this.api.get(`${this.postColl}/?where=${this.onlyPublic}&count=1`);
  }

  getMyPostsCount$(userId: string): Observable<any> {
    const pointerQuery = JSON.stringify({
      "owner": createPointer('_User', userId)
    });

    return this.api.get(`${this.postColl}/?where=${pointerQuery}&count=1`);
  }

  loadAllPosts$(limit: number, sortType: string, skipPosts: number): Observable<any> {
    sortType = this.getSortType(sortType);

    return this.api.get(`${this.postColl}/?where=${this.onlyPublic}&order=${sortType}&skip=${skipPosts}${limit ? `&limit=${limit}` : ''}`);
  }

  loadMyPosts$(limit: number, userId: string, sortType: string, skipPosts: number): Observable<any> {
    const pointerQuery = JSON.stringify({
      "owner": createPointer('_User', userId)
    });

    sortType = this.getSortType(sortType);

    return this.api.get(`${this.postColl}/?where=${pointerQuery}&order=${sortType}&skip=${skipPosts}${limit ? `&limit=${limit}` : ''}`);
  }

  loadPostById$(id: string): Observable<any> {
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

  deletePost$(id: string): Observable<any> {
    return this.api.delete(`${this.postColl}/${id}`);
  }

  updateLikesByPostId$(newLikesData: string[], postId: string): Observable<any> {
    const body = {
      "likes": newLikesData
    }

    return this.api
      .put<any>(`${this.postColl}/${postId}`, body)
      .pipe(
        map(response => response.body));
  }

  getSortType(sortType: string): string {
    if (sortType == this.menuPostsHome.date) {
      return '-createdAt';
    } else {
      return '-likes';
    }
  }
}