// import { FieldValue, Timestamp } from '@google-cloud/firestore';

export interface DisplayNameI {
  displayName: string;
}

export interface HtmlInputEventI extends Event {
  target: HTMLInputElement & EventTarget;
}

// export type SettableTimestampT = Timestamp | FieldValue | Date | undefined;

export type NonEmptyArrayT<T> = [T, ...T[]];
