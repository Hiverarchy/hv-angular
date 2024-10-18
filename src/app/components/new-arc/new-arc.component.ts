import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArcService } from '../../services/arc.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-new-arc',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="new-arc-card">
      <mat-card-content>
        <form [formGroup]="arcForm" (ngSubmit)="createArc()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Create New Arc</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!arcForm.valid">Create Arc</button>
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
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem;
      box-sizing: border-box;
    }
    .new-arc-card {
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
export class NewArcComponent {
  arcForm: FormGroup;
  private arcService = inject(ArcService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.arcForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  async createArc() {
    if (this.arcForm.valid) {
      const newArc = {
        ...this.arcForm.value,
        posts: [],
        arcs: [],
        hierarchy: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const arc = await this.arcService.createArc(newArc);
      this.router.navigate(['/arc', arc.id]);
    }
  }
}
