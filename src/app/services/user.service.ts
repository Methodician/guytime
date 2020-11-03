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
      user.bio !== '';
    // !!user.connectionIds;

    return isValid;
  };
}

const categorizedInterests = {
  Recreation: {
    Backpacking: true,
    Surfing: true,
    SUP: true,
    Wakeboarding: true,
    Skateboarding: true,
    Longboarding: true,
    Snowboarding: true,
    Canoeing: true,
    Cycling: true,
    'Mountain biking': true,
    'Recumbent biking': true,
    Hiking: true,
    'Trail running': true,
    Kayaking: true,
    Mountaineering: true,
    Rafting: true,
    'Rock Climbing': true,
    'Scuba Diving': true,
    'Slack lining': true,
    Skiing: true,
    Snowshoeing: true,
    Rowing: true,
    'Cross-country skiing': true,
    'Body building': true,
    Spinning: true,
    yoga: true,
    Powerlifting: true,
    'Weight Training': true,
    Zumba: true,
    'Long distance running': true,
    jogging: true,
    'Not listed yet': true,
  },
  Hobbies: {
    Camping: true,
    Fishing: true,
    'Fly Fishing': true,
    Frisbee: true,
    'Freestyle Soccer/Football': true,
    Gardening: true,
    'Horseback riding': true,
    Hunting: true,
    'Car Racing': true,
    'Off-road racing': true,
    'Motorcycle racing': true,
    'Dirt bike riding': true,
    'Dirt bike racing': true,
    'Kart Racing': true,
    'Motorboat racing': true,
    Paintball: true,
    Photography: true,
    Sailing: true,
    'Sand Art': true,
    Snowmobiling: true,
    Shooting: true,
    'Tourism/Traveling': true,
    'Vegetable farming': true,
    Videography: true,
    'Vehicle restoration': true,
    Walking: true,
    'Furniture building': true,
    'Home Improvement': true,
    'Grilling and Barbequing': true,
    Smoking: true,
    Herbalisim: true,
    'Urban Exploration': true,
    'Board/Tabletop Games': true,
    'Book Discussion': true,
    'Car fixing': true,
    'Car building': true,
    'Coffee roasting': true,
    'Home brewing': true,
    'Wine making': true,
    'Kombucha brewing': true,
    Cooking: true,
    Welding: true,
    Woodworking: true,
    'Creative writing': true,
    'Crossword Puzzles': true,
    'Digital Arts': true,
    DJing: true,
    Drawing: true,
    'Video gaming': true,
    'Fantasy Sports': true,
    Filmmaking: true,
    'Houseplant care': true,
    'Jigsaw puzzles': true,
    'Leather crafting': true,
    'Lego building': true,
    Magic: true,
    Metalworking: true,
    'Model building': true,
    'Jamming out/musical instruments': true,
    Pottery: true,
    Rapping: true,
    Reading: true,
    Refinishing: true,
    Sewing: true,
    'Stand-up comedy': true,
    'Video editing': true,
    'Watching movies & TV': true,
    'Watching documentaries': true,
    Volunteering: true,
    Mentoring: true,
    Meditation: true,
    'Car stereo enthusiast': true,
    'Magnet fishing': true,
    'Not listed yet': true,
  },
  Collections: {
    Motorcycles: true,
    'Action figures': true,
    Antiques: true,
    Art: true,
    Books: true,
    Coin: true,
    'Comic Books': true,
    Elements: true,
    Knife: true,
    Gun: true,
    Movies: true,
    'Movie memorabilia': true,
    'Pin/lapel': true,
    Record: true,
    Tape: true,
    'Sports memorabilia': true,
    Automobile: true,
    Bicycles: true,
    'Tea Bag': true,
    'Video Games': true,
    'Vintage clothing': true,
    Mineral: true,
    Watch: true,
    'Not listed yet': true,
  },
  Competitive: {
    'Axe throwing': true,
    Badminton: true,
    'Billiards/pool': true,
    Poker: true,
    'Ping pong': true,
    Bowling: true,
    Checkers: true,
    Chess: true,
    Cribbage: true,
    Dancing: true,
    Darts: true,
    Dominoes: true,
    Esports: true,
    'Laser tag': true,
    Marbles: true,
    Trapshooting: true,
    Foosball: true,
    Airsoft: true,
    Archery: true,
    'Disc gold': true,
    'Hacky sack': true,
    Horseshoes: true,
    Racquetball: true,
    'Roller derby': true,
    'Dog sled racing': true,
    'Not listed yet': true,
  },
  Sports: {
    Baseball: true,
    Basketball: true,
    BMX: true,
    Lacrosse: true,
    Volleyball: true,
    'Sand Volleyball': true,
    Running: true,
    'Soccer/Football': true,
    Football: true,
    Taekwondo: true,
    'Tai chi': true,
    Tennis: true,
    Triathlon: true,
    'Ice hockey': true,
    'Street hockey': true,
    Karate: true,
    Boxing: true,
    Judo: true,
    Jujitsu: true,
    Golf: true,
    Pickleball: true,
    Softball: true,
    Kickball: true,
    'Ultimate Frisbee': true,
    'Not listed yet': true,
  },
};
