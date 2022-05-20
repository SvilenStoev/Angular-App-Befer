import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CreatedBeforePipe } from './pipes/created-before.pipe';
import { ReplaceArgsPipe } from './pipes/replace-args.pipe';
import { GenerateCommentsMsgPipe } from './pipes/generate-comments-msg.pipe';



@NgModule({
  declarations: [
    SpinnerComponent,
    CreatedBeforePipe,
    ReplaceArgsPipe,
    GenerateCommentsMsgPipe
  ],
  imports: [
    CommonModule
  ], exports: [
    SpinnerComponent,
    CreatedBeforePipe,
    ReplaceArgsPipe,
    GenerateCommentsMsgPipe
  ]
})
export class SharedModule { }
