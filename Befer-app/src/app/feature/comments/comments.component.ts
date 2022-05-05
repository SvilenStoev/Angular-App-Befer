import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

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
  isAddingComment: boolean = false;
  showLoader: boolean = false;
  userId: string = this.userService.userId;

  @Input() postId: string;
  @ViewChild('saveCommentForm') saveCommentForm: NgForm;
  @Output() commentsCount = new EventEmitter<any>();

  comments: IComment[];

  constructor(
    private commentService: CommentService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loadComments(this.limitComments);
  }

  loadComments(limit: number) {
    this.limitComments = limit;

    this.commentService.loadPostComments$(this.limitComments, this.postId).subscribe({
      next: (res) => {
        this.comments = res.results as IComment[];
        this.commentsCount.emit(this.comments?.length);
      },
      complete: () => {
      },
      error: () => {
      }
    });
  }

  saveHandler(saveCommentForm: NgForm): void {
    const data = saveCommentForm.value;
    const currComment = { content: data.content };

    this.isAddingComment = true;
    this.comments.unshift(currComment);

    this.commentService.createComment$(data, this.postId).subscribe({
      next: () => {
        notifySuccess('The comment is added!');
        saveCommentForm.resetForm();
        this.loadComments(this.limitComments);
      },
      complete: () => {
        this.isAddingComment = false;
      },
      error: () => {
        this.isAddingComment = false;
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

          this.commentsCount.emit(this.comments?.length);
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