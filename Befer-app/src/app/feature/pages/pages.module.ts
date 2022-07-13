import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostsModule } from '../posts/posts.module';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SpaceFightGameComponent } from './space-fight-game/space-fight-game.component';


@NgModule({
  declarations: [
    HomePageComponent,
    NotFoundPageComponent,
    SpaceFightGameComponent
  ],
  imports: [
    CommonModule,
    PostsModule,
    RouterModule,
  ]
})
export class PagesModule { }
