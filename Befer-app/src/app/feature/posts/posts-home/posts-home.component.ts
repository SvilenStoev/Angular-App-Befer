import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IPost } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-posts-home',
  templateUrl: './posts-home.component.html',
  styleUrls: ['./posts-home.component.css']
})
export class PostsHomeComponent implements OnInit {

  posts: IPost[];
  limitPosts: number = 5;
  showLoader: boolean = false;

  constructor(private postService: PostService, private userService: UserService) { }

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.showLoader = true;

    this.postService.loadPosts(this.limitPosts).subscribe({
      next: (data) => {
        console.log(this.limitPosts);
        this.posts = data.results as IPost[];
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  limitPostsHandler(limit: number) {
    this.limitPosts = limit;
    this.showLoader = true;

    this.postService.loadPosts(this.limitPosts).subscribe({
      next: (data) => {
        console.log(this.limitPosts);
        this.posts = data.results as IPost[];
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }
  
  sortHandler() {

  }
}
