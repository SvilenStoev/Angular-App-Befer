import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { notifyErr } from 'src/app/shared/other/notify';
import { UserService } from 'src/app/services/auth/user.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private langService: LanguageService) { }

  msgs: any = this.langService.get().shared;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.userService.isLogged) {
      return true;
    }

    notifyErr(this.msgs.authGuardLoggedIn);
    return this.router.createUrlTree(['/user/login'], { queryParams: { returnUrl: state.url }});
  }
}
