import { Injectable } from '@angular/core';
import * as fb from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  fsTimestamp = () => fb.firestore.FieldValue.serverTimestamp();
}
