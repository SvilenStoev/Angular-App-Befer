import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';
import { UrlValidatorDirective } from './url-validator.directive';
import { CommentsComponent } from '../comments/comments.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsAllComponent } from './posts-all/posts-all.component';
import { PostsHomeComponent } from './posts-home/posts-home.component';
import { PostsCreateComponent } from './posts-create/posts-create.component';
import { PostDetailsPageComponent } from './post-details-page/post-details-page.component';

@NgModule({
  declarations: [
    PostsHomeComponent,
    PostDetailsPageComponent,
    PostsAllComponent,
    PostsCreateComponent,
    CommentsComponent,
    PostEditComponent,
    UrlValidatorDirective,
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
