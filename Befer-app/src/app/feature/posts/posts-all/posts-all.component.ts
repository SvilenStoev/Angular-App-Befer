import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/interfaces';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts-all',
  templateUrl: './posts-all.component.html',
  styleUrls: ['./posts-all.component.css']
})
export class PostsAllComponent implements OnInit {

  showLoader: boolean = false;
  posts: IPost[];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.showLoader = true;

    this.postService.loadPosts().subscribe({
      next: (data) => {
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
