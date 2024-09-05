import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="welcome-container">
      <h1>Welcome to Hiverarchy</h1>
      <p>Discover the power of hierarchical topic organization!</p>
      <ul>
        <li>Build and visualize complex topic structures</li>
        <li>Easily navigate through interconnected ideas</li>
        <li>Collaborate and share knowledge efficiently</li>
        <li>Enhance your learning and productivity</li>
      </ul>
      <a routerLink="/login" class="cta-button">Get Started</a>
    </div>
  `,
  styles: [`
    .welcome-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    h1 { color: #333; }
    ul {
      text-align: left;
      margin: 2rem 0;
    }
    .cta-button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  `]
})
export class WelcomeComponent {}