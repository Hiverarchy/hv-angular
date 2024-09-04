import { Routes } from '@angular/router';
import { loggedInGuard } from './services/guards/loggedIn.guard';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [loggedInGuard],
    children: [
      { path: '', redirectTo: '/posts', pathMatch: 'full' },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/new', component: NewPostComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      { path: 'posts/:id/edit', component: EditPostComponent },
      // Add other protected routes here
    ]
  },
  { path: '**', redirectTo: '/login' } // Catch-all route
];