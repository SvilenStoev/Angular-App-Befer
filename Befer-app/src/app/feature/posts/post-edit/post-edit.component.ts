import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from 'src/app/interfaces';
import { PostService } from 'src/app/services/post.service';
import { TransferService } from 'src/app/services/transfer.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  titleMinLength: number = 4;
  titleMaxLength: number = 50;
  imgUrlMinLength: number = 10;
  descriptionMaxLength: number = 450;

  showLoader: boolean = false;
  postId: string;
  post: IPost = this.transferService.getData();

  @ViewChild('editPostForm') editPostForm: NgForm;

  constructor(
    private router: Router,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private transferService: TransferService) { }

  ngOnInit(): void {
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
        this.showLoader = false;
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
