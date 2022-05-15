// import { ILanguage } from "src/app/interfaces/language";
// import { LanguageService } from "src/app/services/common/language.service";

// export class LangBase {

//     fullMenu: ILanguage = this.langService.get();

//     constructor(protected langService: LanguageService) {
//        this.langChangeListener();
//     }

//     protected langChangeListener() {
//         this.langService.langEvent$.subscribe(langJson => {
//             this.fullMenu = langJson;
//         });
//     }
// }