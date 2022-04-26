import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { IPost } from 'src/app/interfaces';
import { Title } from '@angular/platform-browser';
import { postConsts } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/services/post.service';
import { notifySuccess } from 'src/app/shared/notify/notify';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  titleMinLength: number = postConsts.titleMinLength;
  titleMaxLength: number = postConsts.titleMaxLength;
  descriptionMaxLength: number = postConsts.descriptionMaxLength;

  showLoader: boolean = false;
  postId: string;
  post: IPost = this.transferService.getData();

  @ViewChild('editPostForm') editPostForm: NgForm;

  constructor(
    private router: Router,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private transferService: TransferService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Edit Post`);

    this.postId = this.activatedRoute.snapshot.params['id'];

    setTimeout(() => {
      this.editPostForm.form.patchValue({
        title: this.post.title,
        beforeImgUrl: this.post.beforeImgUrl,
        afterImgUrl: this.post.afterImgUrl,
        description: this.post.description,
        isPublic: this.post.isPublic
      });
    });
  }

  editHandler(editPostForm: NgForm): void {
    const data = editPostForm.value;

    this.showLoader = true;

    if (data.isPublic == 'true') {
      data.isPublic = true;
    }

    this.postService.editPost$(data, this.postId).subscribe({
      next: () => {
        notifySuccess('The post is edited!');
        this.router.navigate([`posts/details/${this.postId}`]);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  navigateBack() {
    this.router.navigate([`/posts/details/${this.postId}`]);
  }
}
