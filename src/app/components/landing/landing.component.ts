import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { login } from '@app/store/auth/auth.actions';
import { AuthService } from '@app/services/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gtm-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  activeSection: 'none' | 'login' | 'register' = 'none';

  loginForm: FormGroup;
  registerForm: FormGroup;

  loginError = null;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        password: ['', Validators.required],
        confirmPass: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  onLogin = async () => {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.store.dispatch(login({ email, password }));

    // const result = await this.authSvc.signIn(email, password);

    // const isResultError = !!result.code && !!result.message;
    // if (isResultError) {
    //   this.loginError = result;
    //   return;
    // }

    // this.router.navigateByUrl('/guys');
  };

  onRegister = async () => {
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('password').value;

    await this.authSvc.register(email, password);
    this.router.navigateByUrl('/me/edit');
  };

  wasWrongPasswordEntered = () =>
    !!this.loginError &&
    !!this.loginError.code &&
    this.loginError.code === 'auth/wrong-password';
  wasWrongEmailEntered = () =>
    !!this.loginError &&
    !!this.loginError.code &&
    this.loginError.code === 'auth/user-not-found';

  passwordMatchValidator: ValidatorFn = (form: FormGroup) => {
    const confirmPass = form.get('confirmPass').value;
    const pass = form.get('password').value;

    return pass === confirmPass ? null : { passwordMissmatch: true };
  };
}
