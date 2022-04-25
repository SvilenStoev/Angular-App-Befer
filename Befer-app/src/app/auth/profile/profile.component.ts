import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IUser } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEditMode: boolean = false;
  currUser: IUser;
  nameMinLength: number = 4;
  userNameMaxLength: number = 16;
  passwordMinLength: number = 6;
  maxLength: number = 20;

  @ViewChild('editProfileForm') editProfileForm: NgForm;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
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
