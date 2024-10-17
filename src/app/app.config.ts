import {ApplicationConfig, importProvidersFrom, SecurityContext} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getFunctions, provideFunctions} from '@angular/fire/functions';
import {getStorage, provideStorage} from '@angular/fire/storage';

import { routes } from './app.routes';
import { FirebaseConfiguration } from './configuration/firebase.config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './services/auth.service';
import { AuthStore } from './store/auth.store';
import { PostStore } from './store/post.store';
import { PostService } from './services/post.service';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { ArcService } from './services/arc.service';
import { ArcStore } from './store/arc.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(FirebaseConfiguration)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideAnimationsAsync(),
    AuthService,
    AuthStore,
    PostService,
    PostStore,
    ArcService,
    ArcStore,
    importProvidersFrom(
      HttpClientModule,
      MarkdownModule.forRoot()
    ),
  ],
};
