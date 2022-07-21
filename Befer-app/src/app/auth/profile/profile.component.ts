import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { IUser } from 'src/app/interfaces';
import { userConsts } from 'src/app/shared/constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from 'src/app/services/auth/user.service';
import { notifyErr, notifySuccess } from 'src/app/shared/other/notify';
import { LanguageService } from 'src/app/services/common/language.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  //validations variables
  nameMinLength: number = userConsts.fullNameMinLength;
  maxLength: number = userConsts.fullNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;

  currUser: IUser;
  profilePicture: any = '/assets/images/site/profileDefault.png';
  showLoader: boolean = false;
  isEditMode: boolean = false;

  //menu languages
  menu: any = this.langService.get().profile;
  shared: any = this.langService.get().shared;
  validations: any = this.langService.get().validations;
  subscription: Subscription;

  @ViewChild('saveProfileForm') saveProfileForm: NgForm;

  constructor(
    private userService: UserService,
    private titleService: TabTitleService,
    private router: Router,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.profile;
      this.shared = langJson.shared;
      this.validations = langJson.validations;
      this.setTitle();
    });

    this.showLoader = true;

    this.userService.getProfile$().subscribe({
      next: (user) => {
        this.currUser = user as IUser;

        // if (this.currUser.profilePicture) {
        //   this.profilePicture = this.currUser.profilePicture;
        // }
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  editHandler(): void {
    if (!this.currUser) {
      notifyErr(this.menu.messages.notAuthorized);
      this.router.navigate(['/home']);
    }

    this.isEditMode = true;

    setTimeout(() => {
      this.saveProfileForm.form.patchValue({
        email: this.currUser.email,
        username: this.currUser.username,
        fullName: this.currUser.fullName
      })
    });
  }

  saveHandler(saveProfileForm: NgForm) {
    if (!this.currUser) {
      notifyErr(this.menu.messages.notAuthorized)
      this.router.navigate(['/home']);
    }

    const data = saveProfileForm.value;

    // if (!data.profilePicture) {
    //   delete data.profilePicture;
    // }

    // if (typeof this.profilePicture != 'string') {
    //   data.profilePicture = this.profilePicture;
    // }

    this.showLoader = true;

    this.userService.editProfile$(data).subscribe({
      next: () => {
        notifySuccess(this.menu.messages.updatedProfile);
        this.currUser = data;
        this.isEditMode = false;
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // updateProfilePicture(event: Event) {
  //   const input: HTMLInputElement = event.target as HTMLInputElement;

  //   this.profilePicture = input?.files?.[0];
  // }
}