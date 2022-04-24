import { Component, Input, OnInit } from '@angular/core';
import { IComment } from 'src/app/interfaces';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  now = new Date();

  @Input() themeId: string;

  comments: IComment[];

  constructor() { }

  ngOnInit(): void {
    const comment: IComment = {
      objectId: 'sadsa',
      createdAt: '22 Apr 2022 at 08:31:49 UTC',
      updatedAt: '24 Apr 2022 at 15:25:08 UTC',
      content: 'Some nice comment',
      author: {
        __type: "Pointer",
        className: "_User",
        objectId: 'CB5M2z0fmw'
      },
      publication: {
        __type: "Pointer",
        className: "Publication",
        objectId: "lEGpKFDIFO",
      }
    }

    this.comments = [comment];
  }
}
