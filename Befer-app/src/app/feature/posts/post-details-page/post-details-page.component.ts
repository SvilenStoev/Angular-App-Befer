import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IPost } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/auth/user.service';
import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { PostService } from 'src/app//services/components/post.service';
import { TransferService } from 'src/app/services/common/transfer.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { LanguageService } from 'src/app/services/common/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.component.html',
  styleUrls: ['./post-details-page.component.css']
})
export class PostDetailsPageComponent implements OnInit,OnDestroy {

  post: IPost;
  showLoader: boolean = false;
  isOwner: boolean = false;
  isLiked: boolean = false;
  isLiking: boolean = false;
  isDisliking: boolean = false;
  userId: string = this.userService.userId;
  postId: string;
  commCount: number = -1;

  //menu languages
  menu: any = this.langService.get().postsDetails;
  shared: any = this.langService.get().shared;
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private transferData: TransferService,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.postsDetails;
      this.shared = langJson.shared;
      this.setTitle();
    });

    const postId = this.activatedRoute.snapshot.params['id'];
    this.showLoader = true;

    this.postService.loadPostById$(postId).subscribe({
      next: (data) => {
        this.post = data as IPost;
        this.isOwner = this.post.owner.objectId == this.userId;
        this.isLiked = this.post.likes.includes(this.userId);
        this.postId = this.post.objectId;
        this.transferData.setData(this.post);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  onDelete() {
    if (!this.isOwner) {
      notifyErr(this.menu.messages.notAuthorized)
      this.router.navigate(['/home']);
    }

    const choise = confirm(this.menu.messages.confirmDeletion);

    if (choise) {
      this.showLoader = true;

      this.postService.deletePost$(this.postId).subscribe({
        next: () => {
          notifySuccess(this.menu.messages.postDeleted);
          this.router.navigate(['/posts/mine']);
        },
        complete: () => {
          this.showLoader = false;
        },
        error: () => {
          this.showLoader = false;
        }
      });
    }
  }

  likeHandler() {
    if (this.isLiked || this.isOwner) {
      notifyErr(this.menu.messages.canNotLike)
      this.router.navigate(['/home']);
      return;
    }

    if (this.isDisliking) {
      return;
    }

    const previousLikes = this.post.likes;

    this.post.likes.push(this.userId);
    this.isLiked = true;
    this.isLiking = true;

    const newLikesArr = this.post.likes;

    this.postService.updateLikesByPostId$(newLikesArr, this.postId).subscribe({
      next: () => {

      },
      complete: () => {
        this.isLiking = false;
      },
      error: (err) => {
        this.post.likes = previousLikes;
        this.isLiking = false;
        this.isLiked = false;

        notifyErr(err.message);
      }
    });
  }

  dislikeHandler() {
    if (!this.isLiked || this.isOwner) {
      notifyErr(this.menu.messages.canNotDislike)
      this.router.navigate(['/home']);
      return;
    }

    if (this.isLiking) {
      return;
    }

    const previousLikes = this.post.likes;
    const index = this.post.likes.indexOf(this.userId);
    this.isLiked = false;
    this.isDisliking = true;

    if (index >= 0) {
      this.post.likes.splice(index, 1);
    } else {
      return notifyErr('Something went wrong!');
    }

    const newLikesArr = this.post.likes;

    this.postService.updateLikesByPostId$(newLikesArr, this.postId).subscribe({
      next: () => {
      },
      complete: () => {
        this.isDisliking = false;
      },
      error: (err) => {
        this.isDisliking = false;
        this.isLiked = true;
        this.post.likes = previousLikes;

        notifyErr(err.message);
      }
    });
  }

  scrollToSec() {
    document.getElementById('comments')?.scrollIntoView();
  }

  setCommentsCount(count: number): void {
    this.commCount = count;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}