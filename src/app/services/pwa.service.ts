import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  promptEvent$ = new BehaviorSubject(null);

  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', e => {
      this.promptEvent$.next(e);
    });

    this.swUpdate.available.subscribe(e => {
      if (
        confirm(
          'An update is available. Would you like to refresh and get the latest?',
        )
      ) {
        window.location.reload();
      }
    });
  }
}
