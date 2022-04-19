import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IUser } from '../interfaces';
import { StorageService } from '../services/storage.service';
import { ApiService } from './api.service';

export interface CreateUserDto { username: string, fullName: string, email: string, password: string }

@Injectable()
export class UserService {

  currUser: IUser;

  get isLogged() {
    //return true;
    return !!this.currUser;
  }

  constructor(private storage: StorageService, private api: ApiService) {

  }

  login$(userData: { username: string, password: string }): Observable<IUser> {
    return this.api
      .post<IUser>('/login', userData)
      .pipe(
        tap(response => console.log(response)),
        map(response => response.body),
        tap(user => this.currUser = user)
      );
  }

  logout(): void {
    this.storage.setItem('isLogged', false);
  }

  register$(userData: CreateUserDto): Observable<IUser> {
    return this.api.post<IUser>('/users', userData);
  }

}
