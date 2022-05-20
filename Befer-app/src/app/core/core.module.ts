import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ApiService } from '../services/api.service';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../services/auth/user.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PostService } from '../services/components/post.service';
import { ReplaceArgsPipe } from '../shared/pipes/replace-args.pipe';
import { StorageService } from '../services/common/storage.service';
import { TransferService } from '../services/common/transfer.service';
import { LanguageService } from '../services/common/language.service';
import { TabTitleService } from '../services/common/tab-title.service';
import { CommentService } from '../services/components/comment.service';
import { ErrorInterceptor } from '../services/interceptors/error.interceptor';
import { RequestInterceptor } from '../services/interceptors/request.interceptor';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        UserService,
        StorageService,
        PostService,
        ApiService,
        TransferService,
        CommentService,
        LanguageService,
        TabTitleService,
        ReplaceArgsPipe,
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: RequestInterceptor,
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: ErrorInterceptor,
        },
      ]
    }
  }
}
