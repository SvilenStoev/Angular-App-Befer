import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { PostsHomeComponent } from './feature/posts/posts-home/posts-home.component';
import { UserService } from './core/user.service';
import { StorageService } from './core/storage.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PostsHomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    UserService,
    StorageService
  ],
  bootstrap: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppModule { }
