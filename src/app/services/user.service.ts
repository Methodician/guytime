import { Injectable } from '@angular/core';
import { UserI } from 'src/app/models/user';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private NULL_USER: UserI = { activityTypes: [], connectionIds: [] };
  loggedInUser$: BehaviorSubject<UserI> = new BehaviorSubject(this.NULL_USER);

  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private authSvc: AuthService,
  ) {
    this.authSvc.authInfo$.subscribe(authInfo => {
      if (!authInfo.isLoggedIn()) {
        this.loggedInUser$.next(this.NULL_USER);
      } else {
        this.userRef(authInfo.uid)
          .valueChanges()
          .subscribe(user => {
            const { uid } = authInfo;
            this.loggedInUser$.next({ ...user, uid });
          });
      }
    });
  }

  createUser = (user: UserI) => {
    const uid = this.authSvc.authInfo$.value.uid;
    if (uid) {
      return this.userRef(uid).set(user);
    }
    return;
  };

  updateUser = (user: UserI) => {
    const uid = this.authSvc.authInfo$.value.uid;
    if (uid) {
      return this.userRef(uid).update(user);
    }
    return;
  };

  uploadProfileImage = (image: File) => {
    const uid = this.authSvc.authInfo$.value.uid;
    if (uid) {
      try {
        const storageRef = this.afStorage.ref(`profileImages/${uid}`);
        const task = storageRef.put(image);
        return { task, ref: storageRef };
      } catch (error) {
        console.error(error);
      }
    }
    return;
  };

  getLoggedInAvatarUrl = () => {
    const url$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');
    this.authSvc.authInfo$.subscribe(info => {
      this.getAvatarUrl(info.uid).subscribe(url => url$.next(url));
    });
    return url$;
  };

  getAvatarUrl = (uid: string) => {
    const url$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');
    if (uid) {
      this.afStorage
        .ref(`profileImages/${uid}`)
        .getDownloadURL()
        .subscribe(
          url => url$.next(url),
          _ => {
            url$.next('assets/icons/square_icon.svg');
          },
        );
    }
    return url$;
  };

  // REFS
  userRef = (uid: string) =>
    this.afs.collection<UserI>('users').doc<UserI>(uid);
}
