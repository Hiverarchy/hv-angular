import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent, RouterModule],
  template: `
    <div class="post-list-header">
      <h1>Posts</h1>
      <button [routerLink]="['/posts', 'new']" class="new-post-btn">New Hiverarchy</button>
    </div>
    @for (post of postService.posts(); track post.id) {
      <app-post  [post]="post"></app-post>
    }
  `,
  styles: [`
    .post-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .new-post-btn {
      padding: 10px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .new-post-btn:hover {
      background-color: #45a049;
    }
  `]
})
export class PostListComponent implements OnInit {
  postService = inject(PostService);

  ngOnInit() {
    this.postService.loadPostsByUserId();
  }
}