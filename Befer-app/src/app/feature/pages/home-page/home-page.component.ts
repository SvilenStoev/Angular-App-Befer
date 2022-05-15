import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/auth/user.service';
import { LanguageService } from 'src/app/services/common/language.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  menu: any = this.langService.get().home;

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(
    private userService: UserService,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  ngOnInit(): void {
    this.setTitle();

    this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.home;
      this.setTitle();
    });
  }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }
}
