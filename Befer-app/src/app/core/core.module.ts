import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule
  ],
  providers: [

  ]
})
export class CoreModule { 
  static forRoot(): ModuleWithProviders<CoreModule> {
  return {
    ngModule: CoreModule,
    providers: [
      UserService,
      StorageService,
    ]
  }
}
}
