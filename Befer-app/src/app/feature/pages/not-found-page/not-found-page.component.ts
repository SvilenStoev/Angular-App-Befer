import { Component, OnInit } from '@angular/core';
import { TabTitleService } from 'src/app/services/common/tab-title.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit {

  constructor(private titleService: TabTitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Not Found`);
  }
}
