import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces';
import { StorageService } from '../services/storage.service';
import { ApiService } from './api.service';

export interface CreateUserDto { username: string, fullName: string, email: string, password: string }

@Injectable()
export class UserService {

  isLogged = false;

  constructor(private storage: StorageService, private api: ApiService) { 
    this.isLogged = this.storage.getItem('isLogged');
  }

  login(): void {
    this.isLogged = true;
    this.storage.setItem('isLogged', true);
  }

  logout(): void {
    this.isLogged = false;
    this.storage.setItem('isLogged', false);
  }

  register$(userData: CreateUserDto): Observable<IUser> {
    return this.api.post<IUser>('/users', userData);
  }
 
}
