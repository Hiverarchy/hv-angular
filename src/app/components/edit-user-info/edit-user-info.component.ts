import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserInfo } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-edit-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="edit-user-info-card">
      <mat-card-content>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Edit User Info</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">Update User Info</button>
          </div>
          <mat-form-field appearance="fill">
            <mat-label>Display Name</mat-label>
            <input matInput formControlName="displayName" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Photo URL</mat-label>
            <input matInput formControlName="photoURL">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Tags (comma-separated)</mat-label>
            <input matInput formControlName="tags">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Main Page ID</mat-label>
            <input matInput formControlName="mainPageId">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Header HTML</mat-label>
            <textarea matInput rows="5" formControlName="headerHTML"></textarea>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Footer HTML</mat-label>
            <textarea matInput rows="5" formControlName="footerHTML"></textarea>
          </mat-form-field>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem;
      box-sizing: border-box;
    }
    .edit-user-info-card {
      width: 100%;
      height: 100%;
      max-width: 800px;
      margin: auto;
      display: flex;
      flex-direction: column;
    }
    mat-card-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    form {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    button {
      align-self: flex-end;
    }
  `]
})
export class EditUserInfoComponent implements OnInit {
  userForm: FormGroup;
  userInfo: UserInfo | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.userForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      photoURL: [''],
      tags: [''],
      mainPageId: [''],
      headerHTML: [''],
      footerHTML: ['']
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
      if (this.authService.user() && this.authService.user()?.userInfo) {
        this.userInfo = this.authService.user()?.userInfo;
        this.userForm.patchValue({
          displayName: this.userInfo!.displayName,
          email: this.userInfo!.email,
          phoneNumber: this.userInfo!.phoneNumber,
          photoURL: this.userInfo!.photoURL,
          tags: this.userInfo!.tags.join(','),
          mainPageId: this.userInfo!.mainPageId,
          headerHTML: this.userInfo!.headerHTML,
          footerHTML: this.userInfo!.footerHTML
        });
      }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUserInfo: UserInfo = {
        ...this.userForm.value,
        tags: this.userForm.value.tags.split(',').map((tag: string) => tag.trim()),
      };
      this.authService.updateUserInfo(updatedUserInfo);
      this.router.navigate(['/profile']);
    }
  }
}
