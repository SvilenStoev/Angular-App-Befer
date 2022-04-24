import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsHomeComponent } from './posts-home/posts-home.component';
import { PostDetailsPageComponent } from './post-details-page/post-details-page.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsAllComponent } from './posts-all/posts-all.component';
import { PostsCreateComponent } from './posts-create/posts-create.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  declarations: [
    PostsHomeComponent,
    PostDetailsPageComponent,
    PostsAllComponent,
    PostsCreateComponent,
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    PostsHomeComponent
  ]
})
export class PostsModule { }
