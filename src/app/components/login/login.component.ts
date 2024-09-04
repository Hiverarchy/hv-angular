import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>Login</h2>
      <form (ngSubmit)="signIn()">
        <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required>
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
        <button type="submit">Sign In</button>
      </form>
      <button (click)="signInWithGoogle()">Sign In with Google</button>
      <p>Don't have an account? <a (click)="toggleSignUp()">Sign Up</a></p>
      @if (isSignUp) {
        <form (ngSubmit)="signUp()">
          <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required>
          <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
          <button type="submit">Sign Up</button>
        </form>
      }
    </div>
  `
})
export class LoginComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  email = '';
  password = '';
  isSignUp = false;

  async signIn() {
    try {
      this.authStore.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }
  async signUp() {
    try {
      await this.authStore.signUp(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  }

  async signInWithGoogle() {
    try {
      await this.authStore.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
  }
}