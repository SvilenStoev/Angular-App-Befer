import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { notify } from 'src/app/shared/notify/notify';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (this.userService.isLogged) {
      return true;
    }

    notify('You should be logged in to access this page!', 'error');
  
    return this.router.createUrlTree(['/login']);
  }
}
