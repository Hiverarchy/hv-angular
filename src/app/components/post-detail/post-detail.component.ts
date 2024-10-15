import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostStore } from '../../store/post.store';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MarkdownModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="post-container">
      @if (postStore.currentPost()) {
        <mat-card class="post-card">
          <mat-card-header>
            <mat-card-title>{{ postStore.currentPost()!.title }}</mat-card-title>
            <mat-card-subtitle>{{ postStore.currentPost()!.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="markdown-container">
              <markdown [data]="postStore.currentPost()!.content"></markdown>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="editPost()">
              <mat-icon>edit</mat-icon> Edit Post
            </button>
          </mat-card-actions>
          <mat-card-footer>
            <mat-chip-listbox aria-label="Tags">
              @for (tag of postStore.currentPost()!.tags; track tag) {
                <mat-chip-option>{{ tag }}</mat-chip-option>
              }
            </mat-chip-listbox>
          </mat-card-footer>
        </mat-card>
      } @else {
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
      }
    </div>
  `,
  styles: [`
    .post-container {
      margin: 2rem auto;
      max-width: 800px;
    }
    .post-card {
      margin-bottom: 1rem;
    }
    .markdown-container {
      max-height: 70vh;
      overflow-y: auto;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70vh;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
    }
    mat-chip-listbox {
      margin: 1rem;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  postStore = inject(PostStore);
  postId = this.route.snapshot.paramMap.get('id');
  router = inject(Router);

  ngOnInit() {
    if (this.postId) {
      this.loadPost(this.postId);
    }
  }

  editPost() {
    this.router.navigateByUrl(`/posts/edit/${this.postId}`);
  }

  async loadPost(id: string) {
    await this.postStore.getPostById(id);
  }
}