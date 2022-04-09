import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // loginFormGroup: FormGroup = this.formBuilder.group({
  //   username: new FormControl(null, [Validators.required, Validators.minLength(5) ]),
  //   password: new FormControl(null, [Validators.required, Validators.minLength(6) ])
  // });

  loginFormGroup: FormGroup = this.formBuilder.group({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private userService: UserService,
    private router: Router, 
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  loginHandler(): void {
    console.log(this.loginFormGroup);
    console.log("login");
    // this.userService.login();
    // this.router.navigate(['/home']);
  }
}
