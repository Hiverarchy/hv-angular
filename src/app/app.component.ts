import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
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
    MatExpansionModule,
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
        <div class="sidenav-content">
          @if (authService.user()) {
            <mat-accordion class="user-profile-accordion">
              <mat-expansion-panel [expanded]="step() === 0" (opened)="step.set(0)">
                <mat-expansion-panel-header>User Profile</mat-expansion-panel-header>
                <div class="user-info">
                  <img [src]="authService.user()?.userInfo?.photoURL || 'assets/default-avatar.png'" alt="User avatar" class="user-avatar">
                  <h3>{{ authService.user()?.userInfo?.displayName || 'Anonymous' }}</h3>
                  <p>{{ authService.user()?.userInfo?.email }}</p>
                  <p><a routerLink="/edit-user-info">edit user info</a></p>
                  <p><a routerLink="/posts/{{authService.user()?.userInfo?.mainPageId}}">My Page</a></p>
                </div>
                <mat-action-row>
                  <div class="signout-button-container">
                    <button mat-stroked-button color="warn" (click)="authService.logout()">
                      <mat-icon>exit_to_app</mat-icon>
                      Sign Out
                    </button>
                  </div>
                </mat-action-row>
              </mat-expansion-panel>
            </mat-accordion>

            <mat-tab-group class="tab-content">
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
        </div>
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
      display: flex;
      flex-direction: column;
    }
    .sidenav-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
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
    .tab-content {
      flex-grow: 1;
      overflow-y: auto;
    }
    .signout-button-container {
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  `]
})
export class AppComponent {
  currentUser: User | undefined = undefined;
  step = signal(0);

  constructor(public authService: AuthService, public postService: PostService) {
    this.authService.checkAuth();
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(step => step + 1);
  }

  prevStep() {
    this.step.update(step => step - 1);
  }
}
