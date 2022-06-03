import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { postConsts } from 'src/app/shared/constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { notifySuccess } from 'src/app/shared/other/notify';
import { PostService } from 'src/app/services/components/post.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit, OnDestroy {
  //validations variables
  titleMinLength: number = postConsts.titleMinLength;
  titleMaxLength: number = postConsts.titleMaxLength;
  descriptionMaxLength: number = postConsts.descriptionMaxLength;

  showLoader: boolean = false;

  //menu languages
  menu: any = this.langService.get().postModify;
  validations: any = this.langService.get().validations;
  shared: any = this.langService.get().shared;
  subscription: Subscription;

  constructor(
    private router: Router,
    private postService: PostService,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.createTitle);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.postModify;
      this.validations = langJson.validations;
      this.shared = langJson.shared;
      this.setTitle();
    });
  }

  createHandler(createPostForm: NgForm): void {
    this.showLoader = true;
    const data = createPostForm.value;

    if (data.isPublic == 'true') {
      data.isPublic = true;
    }

    this.postService.createPost$(data).subscribe({
      next: (post) => {
        notifySuccess(this.menu.messages.postCreated);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
