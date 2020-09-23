import { Injectable } from '@angular/core';
import { UserI } from '@models/user';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private NULL_USER: UserI = {
    fName: null,
    lName: null,
    age: null,
    relationshipStatus: 'UNSPECIFIED',
    bio: null,
    activityTypes: [],
    connectionIds: [],
  };
  loggedInUser$: BehaviorSubject<UserI> = new BehaviorSubject(this.NULL_USER);

  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private authSvc: AuthService,
    private fbSvc: FirebaseService,
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

  // vvv TEMP DEV CODE
  seedTimestamps = () => {
    const timestamp = this.fbSvc.fsTimestamp();
    this.allUsersRef()
      .get()
      .subscribe(usersSnap => {
        const userSnaps = usersSnap.docs;
        for (let userSnap of userSnaps) {
          const uid = userSnap.id;
          console.log('adding timestamp for', uid);
          userSnap.ref.update({ createdAt: timestamp });
        }
      });
  };
  // ^^^ end temp dev code

  createUser = (user: UserI) => {
    const uid = this.authSvc.authInfo$.value.uid;
    if (uid) {
      user.createdAt = this.fbSvc.fsTimestamp();
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

  addUserContact = (userId: string, contactId: string) =>
    this.userRef(userId).update({
      [`contacts.${contactId}`]: true,
    });

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
  namedUsersRef = () =>
    this.afs.collection<UserI>('users', ref => ref.where('fName', '>', ''));
  allUsersRef = () => this.afs.collection<UserI>('users');
  userRef = (uid: string) => this.allUsersRef().doc<UserI>(uid);

  unreadMessagesDoc = (uid: string) =>
    this.userRef(uid).collection('meta').doc('unreadMessages');

  // HELPERS
  testUserValidity = (user: UserI) => {
    const isValid =
      !!user.fName &&
      user.fName !== '' &&
      !!user.lName &&
      user.lName !== '' &&
      !!user.age &&
      !!user.relationshipStatus &&
      !!user.activityTypes &&
      !!user.bio &&
      user.bio !== '' &&
      !!user.connectionIds;

    return isValid;
  };
}
