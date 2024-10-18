import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Arc } from '../../models/arc.model';
import { ArcService } from '../../services/arc.service';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-arc-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MarkdownModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="arc-container">
      @if (arcService.currentArc()) {
        <mat-card class="arc-card">
          <mat-card-header>
            <mat-card-title>{{ arcService.currentArc()!.name }}</mat-card-title>
            <mat-card-subtitle>{{ arcService.currentArc()!.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="markdown-container">
              <markdown [data]="arcService.currentArc()!.description"></markdown>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="editArc()">
              <mat-icon>edit</mat-icon> Edit Arc
            </button>
          </mat-card-actions>
          <mat-card-footer>
            <mat-chip-listbox aria-label="Posts">
              @for (post of arcService.currentArc()!.posts; track post) {
                <mat-chip-option>{{ post }}</mat-chip-option>
              }
            </mat-chip-listbox>
          </mat-card-footer>
        </mat-card>
      } @else {
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
      }
    </div>
  `,
  styles: [`
    .arc-container {
      margin: 2rem auto;
      max-width: 800px;
    }
    .arc-card {
      margin-bottom: 1rem;
    }
    .markdown-container {
      max-height: 70vh;
      overflow-y: auto;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70vh;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
    }
    mat-chip-listbox {
      margin: 1rem;
    }
  `]
})
export class ArcDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  arcService = inject(ArcService);
  arcId = this.route.snapshot.paramMap.get('id');
  router = inject(Router);

  ngOnInit() {
    if (this.arcId) {
      this.loadArc(this.arcId);
    }
  }

  editArc() {
    this.router.navigateByUrl(`/arc/edit/${this.arcId}`);
  }

  async loadArc(id: string) {
    await this.arcService.getArcById(id);
  }
}
