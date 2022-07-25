import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { whitespaceValidator } from '../util';
import { userConsts } from 'src/app/shared/constants';
import { Subscription } from 'rxjs/internal/Subscription';
import { notifySuccess } from 'src/app/shared/other/notify';
import { UserService } from 'src/app/services/auth/user.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  //validations variables
  userNameMinLength: number = userConsts.userNameMinLength;
  userNameMaxLength: number = userConsts.userNameMaxLength;
  passwordMinLength: number = userConsts.passwordMinLength;
  passwordMaxLength: number = userConsts.passwordMaxLength;
  usernameSymb: number;
  passwordSymb: number;
  isServerErr: boolean = false;

  showLoader: boolean = false;
  isPassVisible: boolean = false;

  //menu languages
  menu: any = this.langService.get().login;
  shared: any = this.langService.get().shared;
  validations: any = this.langService.get().validations;
  subscription: Subscription;
  returnUrl: string;

  loginFormGroup: FormGroup = this.formBuilder.group({
    'username': new FormControl(null, [Validators.required, Validators.minLength(this.userNameMinLength), Validators.maxLength(this.userNameMaxLength), whitespaceValidator]),
    'password': new FormControl(null, [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength), whitespaceValidator])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private titleService: TabTitleService,
    private langService: LanguageService) { }

  setTitle(): void {
    this.titleService.setTitle(this.menu.title);
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.login;
      this.shared = langJson.shared;
      this.validations = langJson.validations;
      this.setTitle();
    });

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
        this.router.navigateByUrl(this.returnUrl);
        notifySuccess(this.menu.messages.loggedInSuccess);
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.loginFormGroup.controls['username'].setErrors({ 'serverErr': true });
        this.loginFormGroup.controls['password'].setErrors({ 'serverErr': true });

        this.isServerErr = true;
        this.showLoader = false;
      }
    });
  }

  showError(controlName: string): boolean {
    if (this.isServerErr) {
      if (!this.loginFormGroup.controls['username'].errors?.['serverErr']) {
        this.loginFormGroup.controls['password'].setErrors(null);
        this.isServerErr = false;
      } else if (!this.loginFormGroup.controls['password'].errors?.['serverErr']) {
        this.loginFormGroup.controls['username'].setErrors(null);
        this.isServerErr = false;
      }
    }

    return this.loginFormGroup.controls[controlName].touched && this.loginFormGroup.controls[controlName].invalid;
  }

  getValError(controlName: string, errorType: string) {
    return this.loginFormGroup.controls[controlName].errors?.[errorType];
  }

  getSymbText(currSymbs: number): string {
    return currSymbs > 1 ? this.shared.symbols : this.shared.symbol;
  }

  eyeToggle(inputEl: any, passType: string) {
    this.isPassVisible = !this.isPassVisible;
    inputEl.type = passType;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}