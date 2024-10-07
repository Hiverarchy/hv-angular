import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostStore } from '../../store/post.store';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MarkdownModule],
  template: `
    <div class="post-container">
      @if (postStore.currentPost()) {
        <h2>{{ postStore.currentPost()!.fileName }}</h2>
        <h2>{{ postStore.currentPost()!.folderName }}</h2>
        <h2>{{ postStore.currentPost()!.title }}</h2>
        <p>{{ postStore.currentPost()!.description }}</p>
        <div class="markdown-container">
          <markdown [data]="postStore.currentPost()!.content"></markdown>
        </div>
        <div>
          <strong>Tags:</strong>
          @for (tag of postStore.currentPost()!.tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
        <button (click)="editPost()">Edit Post</button>
      } @else {
        <p>Loading...</p>
      }
    </div>
  `,
  styles: [`
    .post-container {
      margin: 2rem;
    }
    .markdown-container {
      height: 80vh;
      overflow-y: auto;
    }
    .tag {
      background-color: #e0e0e0;
      padding: 0.2rem 0.5rem;
      margin-right: 0.5rem;
      border-radius: 4px;
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