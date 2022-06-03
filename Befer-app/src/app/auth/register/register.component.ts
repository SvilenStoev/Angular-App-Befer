import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { userConsts } from 'src/app/shared/constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { notifySuccess } from 'src/app/shared/other/notify';
import { LanguageService } from 'src/app/services/common/language.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { CreateUserDto, UserService } from 'src/app/services/auth/user.service';
import { emailValidator, passMissmatchValidator, whitespaceValidator } from '../util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  //validations variables
  usernameSymb: number;
  fullNameSymb: number;
  passwordSymb: number;
  nameMinLength: number = userConsts.fullNameMinLength;
  maxLength: number = userConsts.fullNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;

  showLoader: boolean = false;

  //menu languages
  menu: any = this.langService.get().register;
  shared: any = this.langService.get().shared;
  validations: any = this.langService.get().validations;
  subscription: Subscription;

  get passwordsGroup(): FormGroup {
    return this.registerFormGroup.controls['passwords'] as FormGroup;
  }

  registerFormGroup: FormGroup = this.formBuilder.group({
    'fullName': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.maxLength)]),
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'email': new FormControl(null, [Validators.required, emailValidator]),
    'passwords': new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.maxLength), whitespaceValidator]),
      'repeatPass': new FormControl(null, [Validators.required, passMissmatchValidator]),
    }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.register;
      this.shared = langJson.shared;
      this.validations = langJson.validations;
      this.setTitle();
    });

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
    const { email, fullName, passwords, username } = this.registerFormGroup.value;

    const data: CreateUserDto = {
      username: username,
      fullName: fullName,
      email: email,
      password: passwords.password
    }

    this.showLoader = true;

    this.userService.register$(data).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        notifySuccess(`User ${username} is created successfully.`);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: (err) => {
        const code = err.code;
        this.showLoader = false;

        if (code == '202') {
          this.registerFormGroup.controls['username'].setErrors({ 'serverErr': true });
        } else if (code == '203') {
          this.registerFormGroup.controls['email'].setErrors({ 'serverErr': true });
        }
      }
    });
  }

  showError(controlName: string, sourceGroup: FormGroup = this.registerFormGroup): boolean {
    return sourceGroup.controls[controlName]?.touched && sourceGroup.controls[controlName]?.invalid;
  }

  getValError(controlName: string, errorType: string, sourceGroup: FormGroup = this.registerFormGroup) {
    return sourceGroup.controls[controlName]?.errors?.[errorType];
  }

  getSymbText(currSymbs: number): string {
    return currSymbs > 1 ? this.shared.symbols : this.shared.symbol;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
