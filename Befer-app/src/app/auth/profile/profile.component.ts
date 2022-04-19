import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEditMode: boolean = false;

  @ViewChild('editProfileForm') editProfileForm: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  updateProfile(): void {
    // TODO stoev: continue.
    console.log(this.editProfileForm.value);

    this.isEditMode = false;
  }


}
