// import { Timestamp } from '@google-cloud/firestore';
import { DisplayNameI } from './shared';

// export interface UserI {
//   uid?: string;
//   formattedAddress: string;
//   geopoint: GeoPoint;
//   birthday: Date;
//   fName: string;
//   lName?: string;
//   interests: TInterest[];
//   drinkingHabit: TDrinkingHabit;
//   personalityType: TPersonalityType;
//   imageUrl?: string;
//   bio?: string;
//   email: string;
//   phoneNumber?: string;
//   connectionIds: string[];
//   createdAt: Timestamp;
// }

// export interface UserI {
//   uid?: string;
//   fName?: string;
//   lName?: string;
//   age?: number;
//   relationshipStatus?: RelationshipStatusT;
//   activityTypes: ActivityTypeT[];
//   bio?: string;
//   email?: string;
//   phoneNumber?: string;
//   connectionIds: string[];
//   createdAt?: any;
// }

// Can put private info in another place later, and going to default to containing all properties for FB querying
export interface UserI {
  uid?: string;
  fName: string;
  lName: string;
  age: number;
  relationshipStatus: RelationshipStatusT;
  bio: string;
  activityTypes: ActivityTypeT[];
  connectionIds: string[];
  contacts?: any;
  createdAt?: any;
}

export type RelationshipStatusT =
  | 'SINGLE'
  | 'MARRIED'
  | 'DATING'
  | 'OTHER'
  | 'UNSPECIFIED';
export const RelationshipStatusM = new Map<RelationshipStatusT, DisplayNameI>([
  ['SINGLE', { displayName: 'Single' }],
  ['MARRIED', { displayName: 'Married' }],
  ['DATING', { displayName: 'Dating' }],
  ['OTHER', { displayName: 'Other' }],
  ['UNSPECIFIED', { displayName: 'Unspecified' }],
]);

export type ActivityTypeT =
  | 'OUTDOOR'
  | 'SPORTS'
  | 'MOVIES'
  | 'ARTS'
  | 'READING'
  | 'GAMING'
  | 'COMMUNITY';

export const ActivityTypeM = new Map<ActivityTypeT, ActivityTypeI>([
  ['OUTDOOR', { displayName: 'Outdoor', iconName: 'nature_people' }],
  ['SPORTS', { displayName: 'Sports', iconName: 'sports_football' }],
  ['MOVIES', { displayName: 'Movies', iconName: 'local_movies' }],
  ['ARTS', { displayName: 'Arts', iconName: 'brush' }],
  ['READING', { displayName: 'Reading', iconName: 'menu_book' }],
  ['GAMING', { displayName: 'Gaming', iconName: 'videogame_asset' }],
  ['COMMUNITY', { displayName: 'Community', iconName: 'emoji_people' }],
]);

export interface ActivityTypeI extends DisplayNameI {
  iconName: string;
}

export type TDrinkingHabit = 'REGULAR' | 'SOCIAL' | 'NON_DRINKER';

export const MDrinkingHabit = new Map<TDrinkingHabit, DisplayNameI>([
  ['NON_DRINKER', { displayName: 'Non-drinker' }],
  ['SOCIAL', { displayName: 'Social' }],
  ['REGULAR', { displayName: 'Regular' }],
]);

export type TPersonalityType = 'EXTROVERT' | 'INTROVERT';

export const MPersonalityType = new Map<TPersonalityType, DisplayNameI>([
  ['EXTROVERT', { displayName: 'Extrovert' }],
  ['INTROVERT', { displayName: 'Introvert' }],
]);
