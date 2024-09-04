import { Injectable, inject } from '@angular/core';
import { PostStore, Post } from '../store/post.store';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postStore = inject(PostStore);

  fetchPosts() {
    this.postStore.setLoading(true);
    // Fetch posts from API
    // Then:
    const fetchedPosts: Post[] = [/* ... */];
    this.postStore.setPosts(fetchedPosts);
    this.postStore.setLoading(false);
  }

  createPost(post: Post) {
    // Create post logic
    this.postStore.addPost(post);
  }
}