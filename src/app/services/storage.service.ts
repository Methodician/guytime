import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private afStorage: AngularFireStorage) {}

  getDownloadUrl = (path: string) => {
    const storageRef = this.afStorage.ref(path);
    return storageRef.getDownloadURL().toPromise();
  };
}
