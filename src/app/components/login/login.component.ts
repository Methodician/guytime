import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'gtm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private authSvc: AuthService) {
    this.authSvc.authInfo$.subscribe(
      info => (this.isLoggedIn = info.isLoggedIn()),
    );
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
