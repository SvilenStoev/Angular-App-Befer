import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TabTitleService {

  constructor(private titleService: Title) {

  }

  setTitle(title: string): void {
    this.titleService.setTitle(`${environment.appName} | ${title}`);
  }
}

