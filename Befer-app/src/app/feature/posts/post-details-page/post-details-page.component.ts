import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'src/app/interfaces';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.component.html',
  styleUrls: ['./post-details-page.component.css']
})
export class PostDetailsPageComponent implements OnInit {

  post: IPost;
  showLoader: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService) { }

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.params['id'];
    this.showLoader = true;

    this.postService.loadPostById(postId).subscribe({
      next: (data) => {
        this.post = data as IPost;
        console.log(this.post);
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

}
