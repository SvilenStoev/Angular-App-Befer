import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { notifyErr } from 'src/app/shared/notify/notify';
import { UserService } from 'src/app/services/auth/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (this.userService.isLogged) {
      return true;
    }

    notifyErr('You should be logged in to access this page!');
  
    return this.router.createUrlTree(['/user/login']);
  }
}
