import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { FirebaseService } from '../../services/firebase.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Posts</h1>
    <app-post *ngFor="let post of posts" [post]="post"></app-post>
  `
})
export class PostListComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  posts: Post[] = [];

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    this.posts = await this.firebaseService.getPostsByParentId(null);
  }
}