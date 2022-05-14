import { EventEmitter, Injectable } from '@angular/core';

import { ILanguage } from 'src/app/interfaces/language';
import { environment } from 'src/environments/environment';
import * as enJson from "../../../assets/languages/en.json";
import * as bgJson from "../../../assets/languages/bg.json";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  langEvent$: EventEmitter<any> = new EventEmitter();
  currLang: string = this.getStorageLang() || environment.lang.default;

  constructor() {

  }

  get(): ILanguage {
    const language = this.currLang == environment.lang.en ? enJson : bgJson;
    this.langEvent$.emit(language);

    return language;
  }

  setStorageLang(language: string): void {
    localStorage.setItem(environment.lang.title, language);
    this.currLang = language;
  }

  getStorageLang(): string | null {
    return localStorage.getItem(environment.lang.title);
  }
}
