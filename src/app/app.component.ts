import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-toolbar>User Profile</mat-toolbar>
        <div class="user-info" *ngIf="authService.user() as user">
          <img [src]="user.photoURL || 'assets/default-avatar.png'" alt="User avatar" class="user-avatar">
          <h3>{{ user.displayName || 'Anonymous' }}</h3>
          <p>{{ user.email }}</p>
        </div>
        <mat-nav-list>
          <h3 matSubheader>Your Posts</h3>
          <a mat-list-item *ngFor="let post of postService.posts()" [routerLink]="['/posts', post.id]">
            {{ post.title }}
          </a>
        </mat-nav-list>
        <button mat-raised-button color="primary" class="new-post-btn" [routerLink]="['/posts', 'new']">
          <mat-icon>add</mat-icon>
          New Post
        </button>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
    }
    .user-info {
      padding: 16px;
      text-align: center;
    }
    .user-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 8px;
    }
    .new-post-btn {
      margin: 16px;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  postService = inject(PostService);

  constructor() {
    this.authService.checkAuth();
    this.postService.loadPostsByUserId();
  }
}
