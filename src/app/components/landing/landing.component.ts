import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { login, register } from '@app/store/auth/auth.actions';
import { authError } from '@app/store/auth/auth.selectors';
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
  authError$ = this.store.select(authError);

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPass: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  onLogin = () => {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    return this.store.dispatch(login({ email, password }));
  }

  onRegister = () => {
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('password').value;

    return this.store.dispatch(register({ email, password }));
  }

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
