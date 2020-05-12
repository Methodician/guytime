import { Timestamp, GeoPoint } from '@google-cloud/firestore';
import { IDisplayName } from './shared';

export interface IUser {
  uid?: string;
  formattedAddress: string;
  geopoint: GeoPoint;
  birthday: Date;
  fName: string;
  lName?: string;
  interests: TInterest[];
  drinkingHabit: TDrinkingHabit;
  personalityType: TPersonalityType;
  imageUrl?: string;
  bio?: string;
  email: string;
  phoneNumber?: string;
  connectionIds: string[];
  createdAt: Timestamp;
}

export type TInterest = 'OUTDOORS' | 'INDOORS';

export const MInterest = new Map<TInterest, IDisplayName>([
  ['OUTDOORS', { displayName: 'Outdoors' }],
  ['INDOORS', { displayName: 'Indoors' }],
]);

export type TDrinkingHabit = 'REGULAR' | 'SOCIAL' | 'NON_DRINKER';

export const MDrinkingHabit = new Map<TDrinkingHabit, IDisplayName>([
  ['NON_DRINKER', { displayName: 'Non-drinker' }],
  ['SOCIAL', { displayName: 'Social' }],
  ['REGULAR', { displayName: 'Regular' }],
]);

export type TPersonalityType = 'EXTROVERT' | 'INTROVERT';

export const MPersonalityType = new Map<TPersonalityType, IDisplayName>([
  ['EXTROVERT', { displayName: 'Extrovert' }],
  ['INTROVERT', { displayName: 'Introvert' }],
]);
