import { Timestamp, FieldValue } from '@google-cloud/firestore';

export interface IDisplayName {
  displayName: string;
}

export type TSettableTimestamp = Timestamp | FieldValue | Date | undefined;

export type TNonEmptyArray<T> = [T, ...T[]];
