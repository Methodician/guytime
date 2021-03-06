// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const shouldUseEmulator = location.hostname === 'localhost';
const shouldUseEmulator = false;

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBwb1h6Q74h3SDdI0XY1_9cPFAw7Sat31U',
    authDomain: 'guy-time.firebaseapp.com',
    databaseURL: 'https://guy-time.firebaseio.com',
    projectId: 'guy-time',
    storageBucket: 'guy-time.appspot.com',
    messagingSenderId: '57109098543',
    appId: '1:57109098543:web:312ab5b3367b28081596da',
    measurementId: 'G-K2RSVL04LT',
  },
  shouldUseEmulator,
  geocoding_api_key: 'AIzaSyBwb1h6Q74h3SDdI0XY1_9cPFAw7Sat31U',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
