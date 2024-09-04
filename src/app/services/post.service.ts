import { Injectable, inject } from '@angular/core';
import { PostStore } from '../store/post.store';
import { Post } from '../models/post.model'; // Adjust import path as needed
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postStore = inject(PostStore);
  private authService = inject(AuthService);

  get posts() {
    return this.postStore.posts;
  }

  get selectedPost() {
    return this.postStore.currentPost;
  }

  get isLoading() {
    return this.postStore.loading;
  }

  loadPostsByUserId() {
    if (this.authService.user()) {
      this.postStore.getPostsByUserId(this.authService.user()!.uid);
    }
  }

  loadPost(id: string) {
    this.postStore.getPostById(id);
  }

  createPost(post: Omit<Post, 'id'>) {
    this.postStore.createPost(post);
  }

  updatePost(id: string, post: Partial<Post>) {
    this.postStore.updatePost(id, post);
  }

  deletePost(id: string) {
    this.postStore.deletePost(id);
  }
}