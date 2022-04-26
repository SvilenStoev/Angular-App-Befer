import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { IComment } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comment.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  now = new Date();
  limitComments: number = 5;
  showLoader: boolean = false;
  userId: string = this.userService.userId;

  @Input() postId: string;
  @ViewChild('saveCommentForm') saveCommentForm: NgForm;

  comments: IComment[];

  constructor(
    private commentService: CommentService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loadComments(this.limitComments);
  }

  loadComments(limit: number) {
    this.showLoader = true;
    this.limitComments = limit;

    this.commentService.loadPostComments$(this.limitComments, this.postId).subscribe({
      next: (res) => {
        this.comments = res.results as IComment[];
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  saveHandler(saveCommentForm: NgForm): void {
    const data = saveCommentForm.value;

    this.showLoader = true;

    this.commentService.createComment$(data, this.postId).subscribe({
      next: () => {
        notifySuccess('The comment is added!');
        saveCommentForm.resetForm();
        this.loadComments(this.limitComments);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  onDelete(authorId: string, commentId: string) {
    if (this.userId != authorId) {
      notifyErr('You are not authorized to delete this comment!')
      this.router.navigate(['/home']);
    }

    const choise = confirm('Are you sure you want to delete this comment?');

    if (choise) {
      this.showLoader = true;

      this.commentService.deleteComment$(commentId).subscribe({
        next: () => {
          notifySuccess('The comment was deleted successfully!');

          this.comments = this.comments.filter(function (c) {
            return c.objectId != commentId;
          });
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
}