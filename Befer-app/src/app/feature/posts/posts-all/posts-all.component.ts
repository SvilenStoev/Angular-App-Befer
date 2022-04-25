import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IPost } from 'src/app/interfaces';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posts-all',
  templateUrl: './posts-all.component.html',
  styleUrls: ['./posts-all.component.css']
})
export class PostsAllComponent implements OnInit {
  
  posts: IPost[];
  limitPosts: number = 8;
  sortType: string = 'Date';
  showLoader: boolean = false;
  isMyPosts: boolean = false;

  constructor(
    private postService: PostService, 
    private router: Router, 
    private userService: UserService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | All Posts`);

    this.loadPosts(this.limitPosts);
  }

  loadPosts(limit: number) {
    this.showLoader = true;
    this.limitPosts = limit;

    const url = this.router.url;

    if (url == '/posts/all') {
      this.isMyPosts = false;

      this.postService.loadPosts(this.limitPosts).subscribe({
        next: (data) => {
          if (this.sortType == 'Likes') {
            this.sortByLikes(data.results);
          } else {
            this.sortByDate(data.results);
          }
        },
        complete: () => {
          this.showLoader = false;
        }
      });
    } else if (url == '/posts/mine') {
      this.isMyPosts = true;
      const userId = this.userService.userId;

      this.postService.loadMyPosts(this.limitPosts, userId).subscribe({
        next: (data) => {
          if (this.sortType == 'Likes') {
            this.sortByLikes(data.results);
          } else {
            this.sortByDate(data.results);
          }
        },
        complete: () => {
          this.showLoader = false;
        }
      });
    }
  }

  sortByDate(postsArr: IPost[]): void {
    this.sortType = 'Date';
    this.posts = postsArr.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  sortByLikes(postsArr: IPost[]): void {
    this.sortType = 'Likes';
    this.posts = postsArr.sort((a, b) => b.likes.length - a.likes.length);
  }
}
