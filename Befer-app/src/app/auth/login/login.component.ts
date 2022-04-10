import { Component, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  minlength: number = 5;

  loginFormGroup: FormGroup = this.formBuilder.group({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minlength), whitespaceValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minlength)])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginFormGroup.valueChanges.subscribe(() => {
      console.log('valuechanged');
      if (this.loginFormGroup.controls['username'].errors?.['minlength']) {
        this.usernameSymb = this.loginFormGroup.controls['username'].errors?.['minlength']?.requiredLength - this.loginFormGroup.controls['username'].errors?.['minlength'].actualLength;
      }
      if (this.loginFormGroup.controls['password'].errors?.['minlength']) {
        this.passwordSymb = this.loginFormGroup.controls['password'].errors?.['minlength']?.requiredLength - this.loginFormGroup.controls['password'].errors?.['minlength'].actualLength;
      }
    })
  }

  loginHandler(): void {
    console.log("login");
    // this.userService.login();
    // this.router.navigate(['/home']);
  }
}

const whitespaceValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value;

  if (/\s/g.test(value)) {
    return { whitespace: true };
  }

  return null;
};