import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Create New Hiverarchy</h2>
    <form (ngSubmit)="createPost()">
      <div>
        <label for="title">Title:</label>
        <input id="title" [(ngModel)]="newPost.title" name="title" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" [(ngModel)]="newPost.description" name="description"></textarea>
      </div>
      <div>
        <label for="content">Content:</label>
        <textarea id="content" [(ngModel)]="newPost.content" name="content" required></textarea>
      </div>
      <div>
        <label for="tags">Tags (comma-separated):</label>
        <input id="tags" [(ngModel)]="tagInput" name="tags">
      </div>
      <button type="submit">Create Hiverarchy</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    label {
      font-weight: bold;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
    }
    button {
      align-self: flex-start;
      padding: 0.5rem 1rem;
    }
  `]
})
export class NewPostComponent {
  private postService = inject(PostService);
  private router = inject(Router);
  private authService = inject(AuthService);

  newPost: Omit<Post, 'id'> = {
    title: '',
    description: '',
    content: '',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: null,
    authorId: this.authService.user()!.uid
  };
  tagInput = '';

  async createPost() {
    if (this.newPost.title && this.newPost.content) {
      this.newPost.tags = this.tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const postId = this.postService.createPost({
        ...this.newPost
      });
      this.router.navigate(['/post', postId]);
    }
  }
}
