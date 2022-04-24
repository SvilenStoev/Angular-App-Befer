import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CreatedBeforePipe } from './pipes/created-before.pipe';



@NgModule({
  declarations: [
    SpinnerComponent,
    CreatedBeforePipe
  ],
  imports: [
    CommonModule
  ], exports: [
    SpinnerComponent,
    CreatedBeforePipe
  ]
})
export class SharedModule { }
