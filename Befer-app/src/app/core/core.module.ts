import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PostService } from '../services/post.service';
import { ApiService } from '../services/api.service';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from '../services/interceptors/request.interceptor';
import { ErrorInterceptor } from '../services/interceptors/error.interceptor';

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
