import { ThisReceiver } from '@angular/compiler';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageService } from 'src/app/services/common/language.service';
import { LangBase } from 'src/app/shared/base-classes/langBase';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent extends LangBase {

  menu: any = this.fullMenu.footer;
  currYear: number = Date.now();

  constructor(langService: LanguageService) {
    super(langService);
  }
}