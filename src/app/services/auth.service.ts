import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { User } from '../models/user.model'; // Adjust import path as needed

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  get user() {
    return this.authStore.user;
  }

  get isLoading() {
    return this.authStore.loading;
  }

  checkAuth() {
    this.authStore.checkAuth();
  }

  login(email: string, password: string) {
    this.authStore.login(email, password);
    const url = this.user()?.userInfo?.mainPageId ? `/posts/${this.user()?.userInfo?.mainPageId}` : '/';
    this.router.navigateByUrl(url);
  }

  loginWithGoogle() {
    this.authStore.signInWithGoogle();
    const url = this.user()?.userInfo?.mainPageId ? `/posts/${this.user()?.userInfo?.mainPageId}` : '/';
    this.router.navigateByUrl(url);
  }

  logout() {
    this.authStore.signOut();
    this.router.navigate(['/login']);
  }

  signUp(email: string, password: string) {
    this.authStore.signUp(email, password);
  }

//   updateProfile(user: Partial<User>) {
//     this.authStore.updateProfile(user);
//   }

  isLoggedIn(): boolean {
    return this.user() !== null && this.user() !== undefined;
  }
}