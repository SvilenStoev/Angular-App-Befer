import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator, whitespaceValidator } from '../util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameSymb: number;
  fullNameSymb: number;
  nameMinLength: number = 4;
  userNameMaxLength: number = 16;
  passwordMinLength: number = 6;
  maxLength: number = 20;

  registerFormGroup: FormGroup = this.formBuilder.group({
    'fullName': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.maxLength)]),
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'email': new FormControl(null, [Validators.required, emailValidator]),
    'passwords': new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.maxLength), whitespaceValidator]),
      'repeatPass': new FormControl(null),
    }),
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerFormGroup.valueChanges.subscribe(() => {
      const fullNameMinError = this.getValError('fullName', 'minlength');
      const fullNameMaxError = this.getValError('fullName', 'maxlength');
      const usernameMinError = this.getValError('username', 'minlength');
      const usernameMaxError = this.getValError('username', 'maxlength');

      if (fullNameMinError) {
        this.fullNameSymb = fullNameMinError.requiredLength - fullNameMinError.actualLength;
      } else if (fullNameMaxError) {
        this.fullNameSymb = fullNameMaxError.actualLength - fullNameMaxError.requiredLength;
      }

      if (usernameMinError) {
        this.usernameSymb = usernameMinError.requiredLength - usernameMinError.actualLength;
      } else if (usernameMaxError) {
        this.usernameSymb = usernameMaxError.actualLength - usernameMaxError.requiredLength;
      }
    });
  }

  registerHandler(): void {
    console.log('register');
  }

  showError(controlName: string): boolean {
    return this.registerFormGroup.controls[controlName].touched && this.registerFormGroup.controls[controlName].invalid;
  }

  getValError(controlName: string, errorType: string) {
    return this.registerFormGroup.controls[controlName].errors?.[errorType];
  }
}
