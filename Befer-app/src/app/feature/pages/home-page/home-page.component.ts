import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/auth/user.service';
import { LanguageService } from 'src/app/services/common/language.service';

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
    private titleService: Title,
    private langService: LanguageService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | ${this.menu.title}`);

    this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.home;
    });
  }
}
