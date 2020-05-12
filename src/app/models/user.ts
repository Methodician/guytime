import { Timestamp, GeoPoint } from '@google-cloud/firestore';

export interface User {
  uid?: string;
  formattedAddress: string;
  geopoint: GeoPoint;
  birthdate: Date;
  fName: string;
  lName?: string;
  eventTypes: string[];
  interests: string[];
  imageUrl?: string;
  bio?: string;
  email: string;
  phoneNumber?: string;
  connectionIds: string[];
  createdAt: Timestamp;
}
