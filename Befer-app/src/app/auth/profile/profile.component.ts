import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { IUser } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { userConsts } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEditMode: boolean = false;
  currUser: IUser;
  nameMinLength: number = userConsts.fullNameMinLength;
  maxLength: number = userConsts.fullNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;

  @ViewChild('editProfileForm') editProfileForm: NgForm;

  constructor(private userService: UserService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Profile`);

    this.userService.getProfile$().subscribe({
      next: (user) => {
        this.currUser = user;
      },
      complete: () => {
        
      }
    });
  }

  editHandler(): void {
    this.isEditMode = true;

    setTimeout(() => {
      this.editProfileForm.form.patchValue({
        email: this.currUser.email,
        username: this.currUser.username,
        fullName: this.currUser.fullName
      })
    });
  }

  saveHandler() {
    //TODO
  }

}
