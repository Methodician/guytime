import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  fsTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();
}
