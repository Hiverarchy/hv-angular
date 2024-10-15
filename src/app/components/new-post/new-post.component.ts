import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostStore } from '../../store/post.store';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="new-post-card">
      <mat-card-content>
        <form [formGroup]="postForm" (ngSubmit)="createPost()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Create New Hiverarchy</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!postForm.valid">Create Hiverarchy</button>
          </div>
          <mat-form-field appearance="fill">
            <mat-label>File Name</mat-label>
            <input matInput formControlName="fileName" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Folder Name</mat-label>
            <input matInput formControlName="folderName" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Tags (comma-separated)</mat-label>
            <input matInput formControlName="tags">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput rows="5" formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="fill" class="content-field">
            <mat-label>Content</mat-label>
            <textarea matInput rows="25" formControlName="content" required></textarea>
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
    .new-post-card {
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
    .mat-mdc-form-field-flex {
      height: 100%;
    }
    mat-label {
      height: 5rem;
    }
    .content-field {
      flex-grow: 1;
      margin-bottom: 1rem;
    }
    .content-field textarea {
      height: 100%;
    }
    button {
      align-self: flex-end;
    }
  `]
})
export class NewPostComponent {
  postForm: FormGroup;
  private postStore = inject(PostStore);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      fileName: ['', Validators.required],
      folderName: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      tags: ['']
    });
  }

  async createPost() {
    if (this.postForm.valid) {
      const newPost = {
        ...this.postForm.value,
        tags: this.postForm.value.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== ''),
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: this.authService.user()!.uid,
        parentId: this.postStore.currentPost()!.id !== this.authService.user()!.userInfo.mainPageId ? this.postStore.currentPost()!.id : ''
      };

      const post = await this.postStore.createPost(newPost);
      this.router.navigate(['/post', post.id]);
    }
  }
}
