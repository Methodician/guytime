import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserI } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmit = async () => {
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    try {
      await this.authSvc.register(email, password);
      const user: UserI = { email, activityTypes: [], connectionIds: [] };
      const authSub = this.authSvc.authInfo$.subscribe(async authInfo => {
        if (authInfo.uid) {
          await this.userSvc.createUser(user);
          this.router.navigate(['/me/edit']);
          if (authSub) authSub.unsubscribe();
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      return;
    }
  };
}
