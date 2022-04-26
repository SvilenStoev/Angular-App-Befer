import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { IUser } from 'src/app/interfaces';
import { userConsts } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { notifyErr, notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currUser: IUser;
  profilePicture: any = '/assets/images/profileDefault.png';
  showLoader: boolean = false;
  isEditMode: boolean = false;
  nameMinLength: number = userConsts.fullNameMinLength;
  maxLength: number = userConsts.fullNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;

  @ViewChild('saveProfileForm') saveProfileForm: NgForm;

  constructor(
    private userService: UserService,
    private titleService: Title,
    private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Profile`);

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
      notifyErr('You are not authorized to edit this user!')
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
      notifyErr('You are not authorized to edit this user!')
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
        notifySuccess('The profile is updated!');
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

  // updateProfilePicture(event: Event) {
  //   const input: HTMLInputElement = event.target as HTMLInputElement;

  //   this.profilePicture = input?.files?.[0];
  // }
}