// import { Timestamp } from '@google-cloud/firestore';
import { DisplayNameI, KeyMapI } from './shared';
import { TagI }                           from '@models/tag';
import { IcebreakerAnswerI, IcebreakerI } from '@models/icebreaker';

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
  tags: TagI[];
  icebreakerId?: string;
  icebreakerAnswerText?: string;
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

export type ProfileImageSizeT = 'fullSize' | '90x90' | '45x45';

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

export const ActivityTypeM = new Map<ActivityTypeT, ActivityTypeI>([
  // [
  //   'HEALTH_FITNESS',
  //   {
  //     displayName: 'Health and Fitness',
  //     iconName: 'healthAndFitness',
  //     iconType: 'custom',
  //   },
  // ],
  [
    'FOODIE',
    {
      displayName: 'Food and Drink',
      iconName: 'foodAndDrink',
      iconType: 'custom',
    },
  ],
  [
    'OUTDOOR',
    {
      displayName: 'Outdoor Recreation',
      iconName: 'outdoorRecreation',
      iconType: 'custom',
    },
  ],
  ['SPORTS', { displayName: 'Sports', iconName: 'sports', iconType: 'custom' }],
  [
    'MOVIES',
    { displayName: 'Movies', iconName: 'local_movies', iconType: 'material' },
  ],
  [
    'ART_DESIGN',
    {
      displayName: 'Arts and Crafts',
      iconName: 'artsAndCrafts',
      iconType: 'custom',
    },
  ],
  [
    'READING',
    { displayName: 'Reading', iconName: 'menu_book', iconType: 'material' },
  ],
  [
    'GAMING',
    {
      displayName: 'Gaming',
      iconName: 'videogame_asset',
      iconType: 'material',
    },
  ],
  // [
  //   'COMMUNITY_SVC',
  //   {
  //     displayName: 'Community Service',
  //     iconName: 'emoji_people',
  //     iconType: 'material',
  //   },
  // ],
]);

export interface ActivityTypeI extends DisplayNameI {
  iconName: string;
  iconType: 'custom' | 'material';
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
