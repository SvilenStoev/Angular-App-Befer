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
  sortType: string = 'Date';
  showLoader: boolean = false;

  constructor(private postService: PostService, private userService: UserService) { }

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.loadPosts(this.limitPosts);
  }

  loadPosts(limit: number) {
    this.showLoader = true;
    this.limitPosts = limit;

    this.postService.loadPosts$(this.limitPosts).subscribe({
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

  sortByDate(postsArr: IPost[]): void {
    this.sortType = 'Date';
    this.posts = postsArr.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  sortByLikes(postsArr: IPost[]): void {
    this.sortType = 'Likes';
    this.posts = postsArr.sort((a, b) => b.likes.length - a.likes.length);
  }
}
