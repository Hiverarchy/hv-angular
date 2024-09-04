import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { Post } from '../../models/post.model';
import { PostStore } from '../../store/post.store';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent],
  providers: [PostStore],
  template: `
    <h1>Posts</h1>
    <app-post *ngFor="let post of postStore.posts()" [post]="post"></app-post>
  `
})
export class PostListComponent implements OnInit {
  postStore = inject(PostStore);

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    await this.postStore.getPostsByParentId(null);
  }
}