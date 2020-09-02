import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  isLoggedIn = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private authSvc: AuthService) {
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
  }

  onSubmit() {
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    this.authSvc.signIn(email, password);
  }
}
