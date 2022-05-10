import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { IPost } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/auth/user.service';
import { PostService } from 'src/app//services/components/post.service';
import { TransferService } from 'src/app/services/common/transfer.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.component.html',
  styleUrls: ['./post-details-page.component.css']
})
export class PostDetailsPageComponent implements OnInit {

  post: IPost;
  showLoader: boolean = false;
  isOwner: boolean = false;
  isLiked: boolean = false;
  isLiking: boolean = false;
  isDisliking: boolean = false;
  userId: string = this.userService.userId;
  postId: string;
  commCount: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private transferData: TransferService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Post Details`);

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
      notifyErr('You are not authorized to delete this post!')
      this.router.navigate(['/home']);
    }

    const choise = confirm('Are you sure you want to delete this post?');

    if (choise) {
      this.showLoader = true;

      this.postService.deletePost$(this.postId).subscribe({
        next: () => {
          notifySuccess('The post was deleted successfully!');
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
      notifyErr('You can not like this post!')
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
      notifyErr('You can not dislike this post!')
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
        this.post.likes = previousLikes;

        notifyErr(err.message);
      }
    });
  }

  scrollToSec() {
    document.getElementById('comments')?.scrollIntoView();
  }

  commentsCount(count: number): void {
    this.commCount = count;
  }

  commentsMassage(): string { 
    let msg = '';

    if (this.commCount == -1) {
      return '';
    }

    if (this.commCount == 0) {
      msg = 'There are no comments for this post! Why not write one?';
    } else if (this.commCount == 1) {
      msg = `There is 1 comment for this post. See it!`;
    } else {
      msg = `There are ${this.commCount} comments for this post. Check them!`;
    }

    return msg; 
  }
}
