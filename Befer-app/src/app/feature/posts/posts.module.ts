import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsHomeComponent } from './posts-home/posts-home.component';
import { PostDetailsPageComponent } from './post-details-page/post-details-page.component';
import { PostsRoutingModule } from './posts-routing.module';

@NgModule({
  declarations: [
    PostsHomeComponent,
    PostDetailsPageComponent,
  ],
  imports: [
    CommonModule,
    PostsRoutingModule
  ],
  exports: [
    PostsHomeComponent
  ]
})
export class PostsModule { }
