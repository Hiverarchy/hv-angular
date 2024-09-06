import { Injectable, inject } from '@angular/core';
import { PostStore } from '../store/post.store';
import { Post } from '../models/post.model'; // Adjust import path as needed
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postStore = inject(PostStore);
  private authService = inject(AuthService);

  get selectedPost() {
    return this.postStore.currentPost;
  }

  get isLoading() {
    return this.postStore.loading;
  }

  getPostsByUserId() {
    if (this.authService.user()) {
      this.postStore.getPostsByUserId(this.authService.user()!.uid);
    }
  }

  getPostsByParentId(parentId: string) {
    this.postStore.getPostsByParentId(parentId);
  }

  getPost(id: string) {
    this.postStore.getPostById(id);
  }

  createPost(post: Omit<Post, 'id'>) {
    this.postStore.createPost(post);
  }

  updatePost(id: string, partialPost: Partial<Post>, post: Post) {
    this.postStore.updatePost(id, partialPost, post);
  }

  deletePost(id: string) {
    this.postStore.deletePost(id);
  }
}