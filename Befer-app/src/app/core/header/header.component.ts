import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { notifyErr } from 'src/app/shared/notify/notify';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  private isLoggingOut: boolean = false;
  showLoader: boolean = false;

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(public userService: UserService, private router: Router, private storage: StorageService) { }

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
      },
      error: (err) => {
        this.isLoggingOut = false;
        this.showLoader = false;

        const errMessage = err.error.error;
        notifyErr(errMessage);
      }
    });
  }
}
