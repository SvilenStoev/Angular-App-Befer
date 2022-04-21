import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/interfaces';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-posts-home',
  templateUrl: './posts-home.component.html',
  styleUrls: ['./posts-home.component.css']
})
export class PostsHomeComponent implements OnInit {

  showLoader: boolean = false;
  posts: IPost[];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.showLoader = true;
    
    this.postService.loadPosts(5).subscribe({
      next: (data) => {
        this.posts = data.results as IPost[];
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }
}
