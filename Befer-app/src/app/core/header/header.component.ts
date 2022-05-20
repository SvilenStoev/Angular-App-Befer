import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { UserService } from 'src/app/services/auth/user.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  private isLoggingOut: boolean = false;
  currLang: string = this.langService.currLang;
  menu: any = this.langService.get().header;
  showLoader: boolean = false;

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private storage: StorageService,
    private langService: LanguageService) { }

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
        notifySuccess(this.menu.messages.loggedOutSuccess);
      },
      error: (err) => {
        this.isLoggingOut = false;
        this.showLoader = false;

        notifySuccess(this.menu.messages.somethingWrong);

        notifyErr(err.message);
      }
    });
  }

  changeLang(language: string): void {
    this.currLang = language;
    this.langService.setStorageLang(language);

    const newLang = this.langService.get();

    this.menu = newLang.header;
    this.langService.langEvent$.emit(newLang);
  }
}