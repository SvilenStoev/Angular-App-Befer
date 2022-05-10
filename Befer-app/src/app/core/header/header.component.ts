import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { UserService } from 'src/app/services/auth/user.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  private isLoggingOut: boolean = false;
  currLang: string = this.language.currLang;
  menu: any = this.language.get().header;
  showLoader: boolean = false;

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(
    public userService: UserService,
    private router: Router,
    private storage: StorageService,
    private language: LanguageService) { }

  logoutHandler(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.showLoader = true;

    this.userService.logout$().subscribe({
      complete: () => {
        this.isLoggingOut = false;
        this.showLoader = false;

        this.storage.clearUserData();
        this.router.navigate(['/home']);
        notifySuccess('You have successfully logged out.');
      },
      error: (err) => {
        this.isLoggingOut = false;
        this.showLoader = false;

        notifySuccess('Something went wrong!');

        notifyErr(err.message);
      }
    });
  }

  changeLang(language: string): void {
    this.currLang = language;
    this.language.setStorageLang(language);
    this.menu = this.language.get().header;
  }
}
