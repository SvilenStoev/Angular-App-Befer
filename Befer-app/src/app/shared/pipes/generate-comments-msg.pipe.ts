import { Pipe, PipeTransform } from '@angular/core';
import { ReplaceArgsPipe } from './replace-args.pipe';

@Pipe({
  name: 'generateCommentsMsg'
})
export class GenerateCommentsMsgPipe implements PipeTransform {

  constructor(private replaceArgs: ReplaceArgsPipe) {

  }

  transform(text: string, commCount: number, langMenu: any): string {
    if (text) {
      return '';
    }

    if (commCount == -1) {
      return '';
    }

    if (commCount == 0) {
      text = langMenu.noComments;
    } else if (commCount == 1) {
      text = langMenu.oneComment;
    } else {
      text = this.replaceArgs.transform(langMenu.manyComments, commCount);
    }

    return text;
  }
}
