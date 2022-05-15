import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  menu: any = this.langService.get().footer;
  currYear: number = Date.now();

  constructor(private langService: LanguageService) { }

  ngOnInit(): void {
    this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.footer;
    });
  }
}