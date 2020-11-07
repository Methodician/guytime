import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { map, switchMap, tap } from 'rxjs/operators';

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
    const actionIfInvalid = () => {
      alert(
        'There is some required info missing from your profile. We need to update profile edit to show you which info is necessary to proceed... It is beta so give us some slack. In the mean time just try to make your profile as complete as you can...',
      );
      this.router.navigateByUrl('/me/edit');
    };
    return this.authSvc.isLoggedIn$.pipe(
      switchMap(isLoggedIn =>
        !isLoggedIn
          ? of(false)
          : this.authSvc.authInfo$.pipe(
              map(info => info.uid),
              switchMap(
                uid =>
                  !!uid &&
                  this.userSvc
                    .userRef(uid)
                    .valueChanges()
                    .pipe(
                      map(
                        user => !!user && this.userSvc.testUserValidity(user),
                      ),
                    ),
              ),
              tap(isValid => !isValid && actionIfInvalid()),
            ),
      ),
    );
  }
}
