import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (post) {
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <div [innerHTML]="post.content"></div>
      <div>
        <strong>Tags:</strong>
        @for (tag of post.tags; track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>
      <button [routerLink]="['/edit-post', post.id]">Edit Post</button>
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
  firebaseService = inject(FirebaseService);

  post: Post | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPost(id);
      }
    });
  }

  async loadPost(id: string) {
    this.post = await this.firebaseService.getPostById(id);
  }
}