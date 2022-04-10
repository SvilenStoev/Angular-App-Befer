import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator, passMissmatchValidator, whitespaceValidator } from '../util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameSymb: number;
  fullNameSymb: number;
  passwordSymb: number;
  nameMinLength: number = 4;
  userNameMaxLength: number = 16;
  passwordMinLength: number = 6;
  maxLength: number = 20;

  get passwordsGroup(): FormGroup {
    return this.registerFormGroup.controls['passwords'] as FormGroup;
  }

  registerFormGroup: FormGroup = this.formBuilder.group({
    'fullName': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.maxLength)]),
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'email': new FormControl(null, [Validators.required, emailValidator]),
    'passwords': new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.maxLength), whitespaceValidator]),
      'repeatPass': new FormControl(null, [ Validators.required, passMissmatchValidator ]),
    }),
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerFormGroup.valueChanges.subscribe(() => {
      const fullNameMinError = this.getValError('fullName', 'minlength');
      const fullNameMaxError = this.getValError('fullName', 'maxlength');
      const usernameMinError = this.getValError('username', 'minlength');
      const usernameMaxError = this.getValError('username', 'maxlength');
      const passMinError = this.getValError('password', 'minlength', this.passwordsGroup);
      const passMaxError = this.getValError('password', 'maxlength', this.passwordsGroup);

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

      if (passMinError) {
        this.passwordSymb = passMinError.requiredLength - passMinError.actualLength;
      } else if (passMaxError) {
        this.passwordSymb = passMaxError.actualLength - passMaxError.requiredLength;
      }
    });
  }

  registerHandler(): void {
    console.log('register');
  }

  showError(controlName: string, sourceGroup: FormGroup = this.registerFormGroup): boolean {
    return sourceGroup.controls[controlName]?.touched && sourceGroup.controls[controlName]?.invalid;
  }

  getValError(controlName: string, errorType: string, sourceGroup: FormGroup = this.registerFormGroup) {
    return sourceGroup.controls[controlName]?.errors?.[errorType];
  }
}
