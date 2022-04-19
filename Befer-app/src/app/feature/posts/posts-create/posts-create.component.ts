import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {

  titleMinLength: number = 4;
  titleMaxLength: number = 50;
  imgUrlMinLength: number = 10;
  descriptionMaxLength: number = 450;

  constructor(private router: Router, private postService: PostService) { }

  ngOnInit(): void {
  }

  createHandler(createPostForm: NgForm): void {
    const data = createPostForm.value;

    if (data.isPublic == 'true') {
      data.isPublic = true;
    }

    const result = this.postService.createPost$(data).subscribe({
      next: (post) => {
        console.log(post);
        notifySuccess('The post is created!');
        this.router.navigate([`/details/${post}`]);
      },
      error: (err) => {
        const errMessage = err.error.error;
        notifyErr(errMessage);
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
