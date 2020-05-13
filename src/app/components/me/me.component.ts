import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {}

  logout = () => this.authSvc.logout();
}
