import { Injectable, inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

interface AuthState {
  user: User | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: undefined,
  loading: false,
  error: null
};

export const AuthStore = signalStore(
  withState(initialState),
  withMethods((store, auth = inject(Auth), router = inject(Router)) => ({
    login: async (email: string, password: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        patchState(store, { user: userCredential.user, loading: false });
        router.navigate(['/']);
      } catch (error) {
        patchState(store, { error: 'Failed to sign in', loading: false });
      }
    },
    signUp: async (email: string, password: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        patchState(store, { user: userCredential.user, loading: false });
        router.navigate(['/']);
      } catch (error) {
        patchState(store, { error: 'Failed to sign up', loading: false });
      }
    },
    signInWithGoogle: async () => {
      patchState(store, { loading: true, error: null });
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        patchState(store, { user: userCredential.user, loading: false });
        router.navigate(['/']);
      } catch (error) {
        patchState(store, { error: 'Failed to sign in with Google', loading: false });
      }
    },
    signOut: async () => {
      patchState(store, { loading: true, error: null });
      try {
        await signOut(auth);
        patchState(store, { user: undefined, loading: false });
        router.navigate(['/login']);
      } catch (error) {
        patchState(store, { error: 'Failed to sign out', loading: false });
      }
    },
    setUser: (user: User | undefined) => patchState(store, { user }),
  }))
);
