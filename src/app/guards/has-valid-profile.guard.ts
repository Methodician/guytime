import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HasValidProfileGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authSvc.authInfo$.pipe(
      switchMap(async info => {
        if (!info.uid) return false;
        const user = await this.userSvc.userRef(info.uid).get().toPromise();
        const isUserValid = this.testUser(user.data());
        if (!isUserValid) this.router.navigate(['/me/edit']);
        return isUserValid;
      }),
    );
  }

  testUser = user => {
    return (
      !!user.fName &&
      !!user.lName &&
      !!user.age &&
      !!user.bio &&
      !!user.relationshipStatus
    );
  };
}