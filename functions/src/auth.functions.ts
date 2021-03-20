import * as functions from 'firebase-functions';
import { KeyMapI } from '.';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(user => {
  const { uid } = user;

  const newUser: UserI = {
    fName: '',
    lName: '',
    age: 0,
    relationshipStatus: 'UNSPECIFIED',
    bio: '',
    activityTypes: [],
    connectionIds: [],
    uploadedProfileImageMap: {},
    contacts: {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = admin.firestore().doc(`users/${uid}`);
  return docRef.set(newUser);
});

// All these interfaces and types are duplicated. Should be migrated to top level shared models.
export interface UserI {
  uid?: string;
  fName: string;
  lName: string;
  age: number;
  relationshipStatus: RelationshipStatusT;
  bio: string;
  activityTypes: ActivityTypeT[];
  connectionIds: string[];
  uploadedProfileImageMap?: ProfileImageNameMapI;
  contacts?: KeyMapI<boolean>;
  createdAt?: any;
}

export interface ProfileImageNameMapI {
  fullSize?: ProfileImageTrackerI;
  '90x90'?: ProfileImageTrackerI;
  '45x45'?: ProfileImageTrackerI;
}

export interface ProfileImageTrackerI {
  fileName: string;
  imageUpdateRando: string;
}

export type RelationshipStatusT =
  | 'SINGLE'
  | 'MARRIED'
  | 'DATING'
  | 'OTHER'
  | 'UNSPECIFIED';

// export type ActivityTypeT =
//   | 'OUTDOOR'
//   | 'SPORTS'
//   | 'MOVIES'
//   | 'ART_DESIGN'
//   | 'READING'
//   | 'GAMING'
//   | 'COMMUNITY_SVC';
export type ActivityTypeT =
  // | 'HEALTH_FITNESS'
  | 'FOODIE'
  | 'OUTDOOR'
  | 'SPORTS'
  | 'MOVIES'
  | 'ART_DESIGN'
  | 'READING'
  | 'GAMING';
// | 'COMMUNITY_SVC';
