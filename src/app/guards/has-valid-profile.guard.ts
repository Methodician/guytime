import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '@services/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { authUid, isLoggedIn } from '@app/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class HasValidProfileGuard implements CanActivate {
  constructor(
    private store: Store,
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

    return this.store.select(isLoggedIn).pipe(
      switchMap(isUserLoggedIn =>
        !isUserLoggedIn
          ? of(false)
          : this.store.select(authUid).pipe(
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
