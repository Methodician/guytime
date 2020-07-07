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

export interface UserI {
  uid?: string;
  fName?: string;
  lName?: string;
  age?: number;
  relationshipStatus?: RelationshipStatusT;
  activityTypes: ActivityTypeT[];
  bio?: string;
  email?: string;
  phoneNumber?: string;
  connectionIds: string[];
  createdAt?: any;
}

export type RelationshipStatusT = 'SINGLE' | 'MARRIED' | 'DATING' | 'OTHER';
export const RelationshipStatusM = new Map<RelationshipStatusT, DisplayNameI>([
  ['SINGLE', { displayName: 'Single' }],
  ['MARRIED', { displayName: 'Married' }],
  ['DATING', { displayName: 'Dating' }],
  ['OTHER', { displayName: 'Other' }],
]);

export type ActivityTypeT = 'INDOOR' | 'OUTDOOR';

export const ActivityTypeM = new Map<ActivityTypeT, ActivityTypeI>([
  ['INDOOR', { displayName: 'Indoor', iconName: 'home_work' }],
  ['OUTDOOR', { displayName: 'Outdoor', iconName: 'nature_people' }],
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
