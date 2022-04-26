import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { postConsts } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/services/post.service';
import { notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  titleMinLength: number = postConsts.titleMinLength;
  titleMaxLength: number = postConsts.titleMaxLength;
  descriptionMaxLength: number = postConsts.descriptionMaxLength;
  showLoader: boolean = false;

  constructor(
    private router: Router, 
    private postService: PostService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Posts Create`);
  }

  createHandler(createPostForm: NgForm): void {
    this.showLoader = true;
    const data = createPostForm.value;

    if (data.isPublic == 'true') {
      data.isPublic = true;
    }

    this.postService.createPost$(data).subscribe({
      next: (post) => {
        notifySuccess('The post is created!');
        this.router.navigate([`posts/details/${post.objectId}`]);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
