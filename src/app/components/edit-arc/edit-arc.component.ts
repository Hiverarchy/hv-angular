import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArcService } from '../../services/arc.service';
import { Arc } from '../../models/arc.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-arc',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="edit-arc-card">
      <mat-card-content>
        <form [formGroup]="arcForm" (ngSubmit)="onSubmit()">
          <div class="header">
            <mat-card-header>
              <mat-card-title>Edit Arc</mat-card-title>
            </mat-card-header>
            <button mat-raised-button color="primary" type="submit" [disabled]="!arcForm.valid">Update Arc</button>
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
    .edit-arc-card {
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
export class EditArcComponent implements OnInit {
  arcForm: FormGroup;
  arcId: string;
  arc: Arc | undefined = undefined;

  private arcService = inject(ArcService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.arcForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    this.arcId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadArc();
  }

  loadArc() {
    this.arcService.getArcById(this.arcId).then(arc => {
      if (arc) {
        this.arc = arc;
        this.arcForm.patchValue({
          name: arc.name,
          description: arc.description
        });
      }
    });
  }

  onSubmit() {
    if (this.arcForm.valid) {
      const updatedArc = {
        ...this.arcForm.value,
        id: this.arcId
      };
      this.arcService.updateArc(this.arcId, updatedArc, this.arc!);
      this.router.navigate(['/arc', this.arcId]);
    }
  }
}
