import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/auth/user.service';
import { LanguageService } from 'src/app/services/common/language.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  menu: any = this.langService.get().home;
  subscription: Subscription;

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(
    private userService: UserService,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.home;
      this.setTitle();
    });
  }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
