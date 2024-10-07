import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostStore } from '../../store/post.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="edit-post-card">
      <mat-card-content>
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Edit Post</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!postForm.valid">Update Post</button>
          </div>          
          <mat-form-field appearance="fill">
            <mat-label>File Name</mat-label>
            <input matInput formControlName="fileName" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Folder Name</mat-label>
            <input matInput formControlName="folderName" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Tags (comma-separated)</mat-label>
            <input matInput formControlName="tags">
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput rows="5" formControlName="description"></textarea>
          </mat-form-field> <mat-form-field appearance="fill" class="content-field">
            <mat-label>Content</mat-label>
            <textarea matInput rows="25" formControlName="content" required></textarea>
          </mat-form-field>
        </form>
      </mat-card-content>
    </mat-card>
  `,
 styles: [`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    box-sizing: border-box;
  }
  .edit-post-card {
    width: 100%;
    height: 100%;
    max-width: 800px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }
  mat-card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  mat-form-field {
    width: 100%;
  }
  .mat-mdc-form-field-flex {
    height: 100%;
  }
  mat-label {
    height: 5rem;
  }
  .content-field {
    height: 100%;
    margin-bottom: 1rem;
  }
  .content-field textarea {
    height: 100%;
  }
  button {
    align-self: flex-end;
  }
`]
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  postId: string;
  post: Post | undefined = undefined;

  postStore = inject(PostStore);
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.postForm = this.fb.group({
      fileName: ['', Validators.required],
      folderName: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      tags: ['']
    });
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadPost();
  }

  loadPost() {
    console.log('Loading post...');
    this.postStore.getPostById(this.postId).then(post => {
      console.log('Post loaded:', post);
      if (post) {
        this.post = post;
        console.log('Patching form values...');
        this.postForm.patchValue({
          fileName: post.fileName,
          folderName: post.folderName,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags ? post.tags.join(','): ''
        });
        console.log('Form values after patch:', this.postForm.value);
      }
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const updatedPost = {
        ...this.postForm.value,
        id: this.postId
      };
      this.postStore.updatePost(this.postId, updatedPost, this.post!);
      this.router.navigate(['/posts', this.postId]);
    }
  }
}