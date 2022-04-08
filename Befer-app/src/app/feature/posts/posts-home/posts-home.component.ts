import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/interfaces';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-posts-home',
  templateUrl: './posts-home.component.html',
  styleUrls: ['./posts-home.component.css']
})
export class PostsHomeComponent implements OnInit {

  posts: IPost[];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.loadPosts(5).subscribe(data => {
      this.posts = data.results as IPost[];
    });
    
  }
}
