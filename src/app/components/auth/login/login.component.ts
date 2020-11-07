import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'gtm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  isLoggedIn = false;
  form: FormGroup;

  loginError = null;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
  ) {
    this.authSvc.authInfo$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => (this.isLoggedIn = info.isLoggedIn()));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });

    this.authSvc.isLoggedIn$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoggedIn => isLoggedIn && this.router.navigateByUrl('/me'));
  }

  onSubmit = async () => {
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    const result = await this.authSvc.signIn(email, password);

    const isResultError = !!result.code && !!result.message;
    if (isResultError) {
      this.loginError = result;
    }
  };

  wasWrongPasswordEntered = () =>
    !!this.loginError &&
    !!this.loginError.code &&
    this.loginError.code === 'auth/wrong-password';

  wasWrongEmailEntered = () =>
    !!this.loginError &&
    !!this.loginError.code &&
    this.loginError.code === 'auth/user-not-found';
}
