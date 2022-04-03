import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'src/app/core/interfaces';
import { PostService } from 'src/app/core/post.service';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.component.html',
  styleUrls: ['./post-details-page.component.css']
})
export class PostDetailsPageComponent implements OnInit {

  post: IPost;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService) { }
  
  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.params['id'];

    this.postService.loadPostById(postId).subscribe(data => {
      this.post = data as IPost;
      console.log(this.post);
    });
  }

}
