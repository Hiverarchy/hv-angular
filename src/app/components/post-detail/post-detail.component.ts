import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostStore } from '../../store/post.store';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (postStore.currentPost()) {
      <h2>{{ postStore.currentPost()!.title }}</h2>
      <p>{{ postStore.currentPost()!.description }}</p>
      <div [innerHTML]="postStore.currentPost()!.content"></div>
      <div>
        <strong>Tags:</strong>
        @for (tag of postStore.currentPost()!.tags; track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>
      <button [routerLink]="['/edit-post', postStore.currentPost()!.id]">Edit Post</button>
    } @else {
      <p>Loading...</p>
    }
  `,
  styles: [`
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


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPost(id);
      }
    });
  }

  async loadPost(id: string) {
    await this.postStore.getPostById(id);
  }
}