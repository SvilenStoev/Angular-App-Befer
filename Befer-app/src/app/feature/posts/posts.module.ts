import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsHomeComponent } from './posts-home/posts-home.component';
import { PostDetailsPageComponent } from './post-details-page/post-details-page.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsAllComponent } from './posts-all/posts-all.component';
import { PostsCreateComponent } from './posts-create/posts-create.component';

@NgModule({
  declarations: [
    PostsHomeComponent,
    PostDetailsPageComponent,
    PostsAllComponent,
    PostsCreateComponent,
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
