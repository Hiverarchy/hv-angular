import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import {provideAuth, getAuth, connectAuthEmulator} from '@angular/fire/auth';
import {provideFirestore, getFirestore, connectFirestoreEmulator} from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import {provideStorage, getStorage} from '@angular/fire/storage'

import { routes } from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app'
import {provideAnimations} from '@angular/platform-browser/animations'
import { FirebaseConfiguration } from '../app/configeration/firebase.config';


// @ts-ignore
export let appConfig: ApplicationConfig
appConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(FirebaseConfiguration)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      provideFunctions(() => getFunctions()),
    ]),
  ],
}
