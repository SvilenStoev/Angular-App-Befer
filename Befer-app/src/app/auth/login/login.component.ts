import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { whitespaceValidator } from '../util';
import { userConsts } from 'src/app/shared/constants';
import { UserService } from 'src/app/services/auth/user.service';
import { environment } from 'src/environments/environment';
import { notifySuccess } from 'src/app/shared/notify/notify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameSymb: number;
  passwordSymb: number;
  showLoader: boolean = false;
  userNameMinLength: number = userConsts.userNameMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  passwordMaxLength: number = userConsts.passwordMaxLength;

  loginFormGroup: FormGroup = this.formBuilder.group({
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.userNameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength), whitespaceValidator])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Login`);

    this.loginFormGroup.valueChanges.subscribe(() => {
      const usernameMinError = this.getValError('username', 'minlength');
      const usernameMaxError = this.getValError('username', 'maxlength');
      const passMinError = this.getValError('password', 'minlength');
      const passMaxError = this.getValError('password', 'maxlength');

      if (usernameMinError) {
        this.usernameSymb = usernameMinError.requiredLength - usernameMinError.actualLength;
      } else if (usernameMaxError) {
        this.usernameSymb = usernameMaxError.actualLength - usernameMaxError.requiredLength;
      }

      if (passMinError) {
        this.passwordSymb = passMinError.requiredLength - passMinError.actualLength;
      } else if (passMaxError) {
        this.passwordSymb = passMaxError.actualLength - passMaxError.requiredLength;
      }
    })
  }

  loginHandler(): void {
    this.showLoader = true;
    const data = this.loginFormGroup.value;

    this.userService.login$(data).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        notifySuccess('Logged in successfully.');
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.loginFormGroup.controls['username'].setErrors({ 'serverErr': true });
        this.loginFormGroup.controls['password'].setErrors({ 'serverErr': true });

        this.showLoader = false;
      }
    });
  }

  showError(controlName: string): boolean {
    return this.loginFormGroup.controls[controlName].touched && this.loginFormGroup.controls[controlName].invalid;
  }

  getValError(controlName: string, errorType: string) {
    return this.loginFormGroup.controls[controlName].errors?.[errorType];
  }
}