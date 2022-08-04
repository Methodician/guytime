import { Injectable }           from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging'

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private fireMessaging: AngularFireMessaging) {
    this.fireMessaging.messages.subscribe(( message: any ) => {
      console.log('Foreground message: ' + message)
    })
  }

  requestToken(): void {
    this.fireMessaging.requestToken.subscribe({
      next: token => {
        // Upload the user FCM token to server
      },
      error: err => {
        console.log(`Fetching FCM token failed: ${err}`)
      }
    })
  }



}
