import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { navIconMap } from './models/icon-maps';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'gtm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private authSvc: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;

    Object.entries(navIconMap).map(([name, path]) => {
      iconRegistry.addSvgIcon(
        name,
        sanitizer.bypassSecurityTrustResourceUrl(path),
      );
    });
  }
}
