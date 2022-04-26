import { Component, Input, OnInit } from '@angular/core';
import { IComment } from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  now = new Date();
  limitComments: number = 5;
  showLoader: boolean = false;

  @Input() postId: string;

  comments: IComment[];

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {

    this.loadComments(this.limitComments);

    // const comment: IComment = {
    //   objectId: 'sadsa',
    //   createdAt: '22 Apr 2022 at 08:31:49 UTC',
    //   updatedAt: '24 Apr 2022 at 15:25:08 UTC',
    //   content: 'Some nice comment',
    //   author: {
    //     __type: "Pointer",
    //     className: "_User",
    //     objectId: 'CB5M2z0fmw'
    //   },
    //   publication: {
    //     __type: "Pointer",
    //     className: "Publication",
    //     objectId: "lEGpKFDIFO",
    //   }
  }

  loadComments(limit: number) {
    this.showLoader = true;
    this.limitComments = limit;

    this.commentService.loadPostComments$(this.limitComments, this.postId).subscribe({
      next: (res) => {
        this.comments = res.results as IComment[];
        console.log(this.comments);
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


