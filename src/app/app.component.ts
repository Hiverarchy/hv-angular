import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { PostService } from './services/post.service';
import { AuthStore } from './store/auth.store';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        @if (authService.user()) {
        <mat-toolbar>User Profile <a routerLink="/edit-user-info">Edit</a></mat-toolbar>
        <div class="user-info">
          <img [src]="authService.user()?.userInfo?.photoURL || 'assets/default-avatar.png'" alt="User avatar" class="user-avatar">
              <h3>{{ authService.user()?.userInfo?.displayName || 'Anonymous' }}</h3>
            <p>{{ authService.user()?.userInfo?.email }}</p>
            <a routerLink="/posts/{{authService.user()?.userInfo?.mainPageId}}">My Page</a>
          <button mat-stroked-button color="warn" (click)="authService.logout()">
            <mat-icon>exit_to_app</mat-icon>
            Sign Out
          </button>
        </div>
        <mat-tab-group>
            <mat-tab label="Your Thoughts">
              <mat-nav-list>
                @for (post of authService.user()?.userInfo?.posts; track post.id) {
                  @if (post.id !== authService.user()?.userInfo?.mainPageId) {
                    <a mat-list-item [routerLink]="['/posts', post.id]">
                      <button mat-icon-button (click)="viewChildren(post.id)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      {{ post.title }}
                      @if (post.id !== authService.user()?.userInfo?.mainPageId) {
                        <button mat-icon-button (click)="deletePost(post.id)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      }
                      @for (child of post.children; track child.id) {
                        <button mat-icon-button (click)="viewChildren(child.id)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        {{ child.title }}
                      }
                    </a>
                  }               
                }
              </mat-nav-list>
              <button mat-raised-button color="primary" class="new-post-btn" [routerLink]="['/posts', 'new']">
                <mat-icon>add</mat-icon>
                New Thought
              </button>
            </mat-tab>
            <mat-tab label="Recent">
              <!-- Add recent thoughts content here -->
            </mat-tab>
            <mat-tab label="Favorites">
              <!-- Add favorite thoughts content here -->
            </mat-tab>
            <mat-tab label="By Tag">
              <!-- Add thoughts by tag content here -->
            </mat-tab>
          </mat-tab-group>
        } @else {
        <div class="user-info">
          <p>You are not logged in.</p>
          <button mat-stroked-button color="primary" routerLink="/login">
            <mat-icon>login</mat-icon>
            Sign In
          </button>
        </div>
        }
       
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
      width: 500px;
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
    .user-info button {
      margin-top: 8px;
    }
  `]
})
export class AppComponent {
  currentUser: User | undefined = undefined;

  constructor(public authService: AuthService, public postService: PostService) {
    this.authService.checkAuth();

  }

  viewChildren(postId: string) {
    this.postService.getPostsByParentId(postId);
  }

  deletePost(postId: string) {
    console.log(postId);
  } 
}
