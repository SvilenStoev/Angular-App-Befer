import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { whitespaceValidator } from '../util';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameSymb: number;
  passwordSymb: number;
  userNameMinLength: number = 4;
  userNameMaxLength: number = 16;
  passwordMinLength: number = 6;
  passwordMaxLength: number = 20;

  loginFormGroup: FormGroup = this.formBuilder.group({
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.userNameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength), whitespaceValidator])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginFormGroup.valueChanges.subscribe(() => {
      const usernameMinError = this.getValError('username', 'minlength');
      const usernameMaxError = this.getValError('username', 'maxlength');
      const passMinError = this.getValError('password', 'minlength');
      const passMaxError = this.getValError('password', 'maxlength');

      if (usernameMinError) {
        this.usernameSymb = usernameMinError.requiredLength - usernameMinError.actualLength;
      } else if (usernameMaxError)  {
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
    console.log("login");
    this.userService.login();
    this.router.navigate(['/home']);
  }

  showError(controlName: string): boolean {
    return this.loginFormGroup.controls[controlName].touched && this.loginFormGroup.controls[controlName].invalid;
  }

  getValError(controlName: string, errorType: string) {
    return this.loginFormGroup.controls[controlName].errors?.[errorType];
  }
}