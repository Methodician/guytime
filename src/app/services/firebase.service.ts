import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import undefined from 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  fsTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();
}
