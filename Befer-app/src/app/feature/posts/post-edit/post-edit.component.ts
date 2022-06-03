import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { IPost } from 'src/app/interfaces';
import { postConsts } from 'src/app/shared/constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { notifySuccess } from 'src/app/shared/other/notify';
import { PostService } from 'src/app/services/components/post.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { TransferService } from 'src/app/services/common/transfer.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit, OnDestroy {
  //validations variables
  titleMinLength: number = postConsts.titleMinLength;
  titleMaxLength: number = postConsts.titleMaxLength;
  descriptionMaxLength: number = postConsts.descriptionMaxLength;

  showLoader: boolean = false;
  postId: string;
  post: IPost = this.transferService.getData();

  //menu languages
  menu: any = this.langService.get().postModify;
  validations: any = this.langService.get().validations;
  shared: any = this.langService.get().shared;
  subscription: Subscription;

  @ViewChild('editPostForm') editPostForm: NgForm;

  constructor(
    private router: Router,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private transferService: TransferService,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.editTitle);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.postModify;
      this.validations = langJson.validations;
      this.shared = langJson.shared;
      this.setTitle();
    });

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
        notifySuccess(this.menu.messages.postEdited);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
