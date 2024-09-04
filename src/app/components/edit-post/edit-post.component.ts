import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostStore } from '../../store/post.store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [PostStore],
  template: `
    <div class="edit-post">
      <h2>Edit Post</h2>
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" formControlName="title" required>
        </div>
        <div>
          <label for="content">Content:</label>
          <textarea id="content" formControlName="content" required></textarea>
        </div>
        <button type="submit" [disabled]="!postForm.valid">Update Post</button>
      </form>
    </div>
  `,
  styles: [`
    .edit-post {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-top: 10px;
    }
    input, textarea {
      margin-bottom: 10px;
      padding: 5px;
    }
    button {
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  postId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  postStore = inject(PostStore);

  ngOnInit() {
    this.loadPost();
  }

  loadPost() {
    this.postStore.getPostById(this.postId).then(post => {
      if (post) {
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      }
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const updatedPost = {
        ...this.postForm.value,
        id: this.postId
      };
      this.postStore.updatePost(this.postId, updatedPost);
      this.router.navigate(['/posts']);
    }
  }
}