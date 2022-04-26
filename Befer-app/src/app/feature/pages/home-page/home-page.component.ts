import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  constructor(private userService: UserService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Home`);
  }
}
