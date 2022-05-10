import { Injectable } from '@angular/core';
import { UserDataDto } from '../auth/user.service';

@Injectable()
export class StorageService {
  localStorage = localStorage;

  setItem<T>(key: string, item: T): T {
    const str = typeof item === 'string' ? item : JSON.stringify(item);
    this.localStorage.setItem(key, str);
    return item;
  }

  getItem<T>(key: string): T {
    let item;
    const tmp = this.localStorage.getItem(key);
    if (!tmp) { return null as any; }
    try {
      item = JSON.parse(tmp);
    } catch {
      item = tmp;
    }
    return item;
  }

  setUserData(userData: UserDataDto) {
    this.setItem('userData', userData);
  }

  getUserData(): UserDataDto {
    return this.getItem('userData') || null;
  }

  clearUserData() {
    localStorage.removeItem('userData');
  }

}
