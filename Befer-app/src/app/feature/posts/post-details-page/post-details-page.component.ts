import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPost } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';
import { PostService } from '../../../services/post.service';

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
  userId: string = this.userService.userId;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.params['id'];
    this.showLoader = true;

    this.postService.loadPostById(postId).subscribe({
      next: (data) => {
        this.post = data as IPost;
        this.isOwner = this.post.owner.objectId == this.userId;
        this.isLiked = this.post.likes.includes(this.userId);
        console.log(this.post);
        console.log(this.isLiked);
        console.log(this.isOwner);
      },
      complete: () => {
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

      this.showLoader = false;

      notifySuccess('The post was deleted successfully!');

      this.router.navigate(['/home']);
    }
  }

  likeHandler() {
    this.showLoader = true;
    const previousLikes = this.post.likes;

    this.post.likes.push(this.userId);
    const newLikesArr = this.post.likes;

    this.postService.updateLikesByPostId$(newLikesArr, this.post.objectId).subscribe({
      next: () => {
        this.isLiked = true;
      },
      complete: () => {
        this.showLoader = false;
      },
      error: (err) => {
        this.showLoader = false;
        this.post.likes = previousLikes;

        notifyErr(err.message);
      }
    });
  }

  dislikeHandler() {
    const previousLikes = this.post.likes;
    const index = this.post.likes.indexOf(this.userId);

    if (index >= 0) {
      this.post.likes.splice(index, 1);
    } else {
      return notifyErr('Something went wrong!');
    }
    
    const newLikesArr = this.post.likes;
    this.showLoader = true;

    this.postService.updateLikesByPostId$(newLikesArr, this.post.objectId).subscribe({
      next: () => {
        this.isLiked = false;
      },
      complete: () => {
        this.showLoader = false;
      },
      error: (err) => {
        this.showLoader = false;
        this.post.likes = previousLikes;

        notifyErr(err.message);
      }
    });
  }
}
