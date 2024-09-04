import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post',
  standalone: true,
  template: `
    <div class="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <div [innerHTML]="post.content"></div>
      <div class="tags">
        @for (tag of post.tags; track tag) {
        <span>{{ tag }}</span> }
      </div>
      <!-- Add buttons for comments, refutations, etc. -->
    </div>
  `,
  styles: [`
    .post {
      border: 1px solid #ccc;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .tags span {
      background-color: #eee;
      padding: 0.2rem 0.5rem;
      margin-right: 0.5rem;
      border-radius: 4px;
    }
  `]
})
export class PostComponent {
  @Input() post!: Post;
}