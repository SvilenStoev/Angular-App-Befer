import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { IComment } from 'src/app/interfaces';
import { UserService } from 'src/app/services/auth/user.service';
import { CommentService } from 'src/app/services/components/comment.service';
import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { LanguageService } from 'src/app/services/common/language.service';

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

  //Edit comment variables
  isEditMode: boolean = false;
  editedCommentId: string = '';
  oldContent: string = '';
  inputClicked: boolean = false;

  @Input() postId: string;
  @ViewChild('saveCommentForm') saveCommentForm: NgForm;
  @Output() commentsCount = new EventEmitter<any>();

  comments: IComment[];

  //menu languages
  menu: any = this.langService.get().comments;
  shared: any = this.langService.get().shared;
  validations: any = this.langService.get().validations;

  constructor(
    private commentService: CommentService,
    private router: Router,
    private userService: UserService,
    private langService: LanguageService) { }

  ngOnInit(): void {
    this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.comments;
      this.shared = langJson.shared;
      this.validations = langJson.validations;
    });

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
        notifySuccess(this.menu.messages.commentAdded);
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
    this.checkIfNotAuthor(authorId);

    const choise = confirm(this.menu.messages.confirmDeletion);

    if (choise) {
      this.showLoader = true;

      this.commentService.deleteComment$(commentId).subscribe({
        next: () => {
          notifySuccess(this.menu.messages.deletedSuccess);

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

  enterEditMode(authorId: string, commentId: string, commentContent: string): void {
    if (this.userId != authorId) {
      return;
    }

    this.oldContent = commentContent;
    this.editedCommentId = commentId;
    this.isEditMode = true;
  }

  leaveEditMode(): void {
    if (this.inputClicked) {
      return;
    }

    this.editedCommentId = '';
    this.isEditMode = false;
  }

  onEditSave(authorId: string, commentId: string) {
    this.checkIfNotAuthor(authorId);

    const content = (document.getElementById('editComment') as HTMLInputElement).value;
    const newComment = { content: content } as any;

    this.clearEditMode();

    if (this.oldContent == content || content == '') {
      return;
    }

    this.comments.forEach(c => {
      if (c.objectId == commentId) {
        c.content = content;
      }
    });

    this.commentService.editComment$(newComment, this.postId, commentId).subscribe({
      next: () => {
        this.loadComments(this.limitComments);
      },
      complete: () => {
      },
      error: () => {
      }
    });
  }

  onEditCancel(): void {
    this.clearEditMode();
  }

  clearEditMode() {
    this.isEditMode = false;
    this.inputClicked = false;
    this.editedCommentId = '';
  }

  checkIfNotAuthor(authorId: string): void {
    if (this.userId != authorId) {
      notifyErr(this.menu.messages.notAuthorized)
      this.router.navigate(['/home']);
    }
  }
}