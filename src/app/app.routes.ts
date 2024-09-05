import { Routes } from '@angular/router';
import { loggedInGuard } from './services/guards/loggedIn.guard';
import { LoginComponent } from './components/login/login.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts/new', component: NewPostComponent, canActivate: [loggedInGuard] },
  { path: 'posts/:id', component: PostDetailComponent, canActivate: [loggedInGuard] },
  { path: 'posts/:id/edit', component: EditPostComponent, canActivate: [loggedInGuard] },
  { path: '**', redirectTo: '/' } // Catch-all route
  ];