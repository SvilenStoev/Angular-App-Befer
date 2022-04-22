import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IUser } from '../interfaces';
import { StorageService } from '../services/storage.service';
import { ApiService } from './api.service';

export interface CreateUserDto { username: string, fullName: string, email: string, password: string }
export interface UserDataDto { username: string, id: string, token: string }

@Injectable()
export class UserService {

  currUser: IUser;

  get isLogged() {
    return !!this.storage.getUserData();
  }

  get userId(): string {
    return this.storage.getUserData().id;
  }

  get getToken(): string {
    return this.storage.getUserData()?.token;
  }

  constructor(private storage: StorageService, private api: ApiService) {

  }

  login$(data: { username: string, password: string }): Observable<IUser> {
    return this.api
      .post<IUser>('/login', data)
      .pipe(
        map(response => response.body),
        tap(user => {
          const userData: UserDataDto = {
            username: user.username,
            id: user.objectId,
            token: user.sessionToken
          };

          this.storage.setUserData(userData);
          this.currUser = user;
        })
      );
  }

  logout$(): Observable<void> {
    return this.api.post<void>('/logout');
  }

  register$(data: CreateUserDto): Observable<IUser> {
    return this.api
      .post<IUser>('/users', data)
      .pipe(
        map(response => response.body),
        tap(user => {
          const userData: UserDataDto = {
            username: user.username,
            id: user.objectId,
            token: user.sessionToken
          };

          this.storage.setUserData(userData);
          this.currUser = user;
        })
      );
  }

  getProfile$(): Observable<any> {
    return this.api.get(`/users/${this.userId}`);
  }

}
