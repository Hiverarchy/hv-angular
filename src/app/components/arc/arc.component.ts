import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArcService } from '../../services/arc.service';
import { PostService } from '../../services/post.service';
import { Arc } from '../../models/arc.model';
import { Post } from '../../models/post.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-arc',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="arc-card">
      <mat-card-content>
        <form [formGroup]="arcForm" (ngSubmit)="onSubmit()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Create or Update Arc</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!arcForm.valid">Save Arc</button>
          </div>
          <mat-form-field appearance="fill">
            <mat-label>Arc Name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Description</mat-label>
            <textarea matInput rows="5" formControlName="description"></textarea>
          </mat-form-field>
        </form>
      </mat-card-content>
    </mat-card>
    <mat-card class="post-card">
      <mat-card-content>
        <form [formGroup]="postForm" (ngSubmit)="addPost()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Add Post to Arc</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!postForm.valid">Add Post</button>
          </div>
          <mat-form-field appearance="fill">
            <mat-label>Post Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Post Content</mat-label>
            <textarea matInput rows="5" formControlName="content" required></textarea>
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
    .arc-card, .post-card {
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
    button {
      align-self: flex-end;
    }
  `]
})
export class ArcComponent implements OnInit {
  arcForm: FormGroup;
  postForm: FormGroup;
  currentArc: Arc | null = null;

  private arcService = inject(ArcService);
  private postService = inject(PostService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.arcForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCurrentArc();
  }

  loadCurrentArc() {
    // Load the current arc if available
    this.arcService.getArcById('currentArcId').then(arc => {
      if (arc) {
        this.currentArc = arc;
        this.arcForm.patchValue({
          name: arc.name,
          description: arc.description
        });
      }
    });
  }

  onSubmit() {
    if (this.arcForm.valid) {
      const arcData = this.arcForm.value;
      if (this.currentArc) {
        this.arcService.updateArc(this.currentArc.id, arcData, this.currentArc).then(() => {
          this.router.navigate(['/arc', this.currentArc!.id]);
        });
      } else {
        this.arcService.createArc(arcData).then(newArc => {
          this.router.navigate(['/arc', newArc.id]);
        });
      }
    }
  }

  addPost() {
    if (this.postForm.valid && this.currentArc) {
      const postData = this.postForm.value;
      const newPost: Post = {
        id: '',
        parentId: null,
        arcId: this.currentArc.id,
        childArcs: [],
        authorId: 'currentUserId',
        fileName: '',
        folderName: '',
        title: postData.title,
        description: '',
        content: postData.content,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.arcService.addPostToArc(this.currentArc.id, newPost).then(() => {
        this.router.navigate(['/arc', this.currentArc!.id]);
      });
    }
  }
}
