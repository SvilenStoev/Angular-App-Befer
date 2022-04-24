import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/interfaces';
import { PostService } from 'src/app/services/post.service';

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

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts(this.limitPosts);
  }

  loadPosts(limit: number) {
    this.showLoader = true;
    this.limitPosts = limit;

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
