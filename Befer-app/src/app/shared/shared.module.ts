import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CreatedBeforePipe } from './pipes/created-before.pipe';
import { ReplaceArgsPipe } from './pipes/replace-args.pipe';



@NgModule({
  declarations: [
    SpinnerComponent,
    CreatedBeforePipe,
    ReplaceArgsPipe
  ],
  imports: [
    CommonModule
  ], exports: [
    SpinnerComponent,
    CreatedBeforePipe,
    ReplaceArgsPipe
  ]
})
export class SharedModule { }
