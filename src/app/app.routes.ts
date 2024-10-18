import { Routes } from '@angular/router';
import { loggedInGuard } from './services/guards/loggedIn.guard';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EditUserInfoComponent } from './components/edit-user-info/edit-user-info.component';
import { ArcComponent } from './components/arc/arc.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'edit-user-info', component: EditUserInfoComponent, canActivate: [loggedInGuard] },
  { path: 'posts/new', 
    loadComponent: () => import('./components/new-post/new-post.component').then(c => c.NewPostComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: 'posts/edit/:id', 
    loadComponent: () => import('./components/edit-post/edit-post.component').then(c => c.EditPostComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: 'posts/:id', 
    loadComponent: () => import('./components/post-detail/post-detail.component').then(c => c.PostDetailComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: 'arc/new', 
    loadComponent: () => import('./components/new-arc/new-arc.component').then(c => c.NewArcComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: 'arc/edit/:id', 
    loadComponent: () => import('./components/edit-arc/edit-arc.component').then(c => c.EditArcComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: 'arc/:id', 
    loadComponent: () => import('./components/arc-detail/arc-detail.component').then(c => c.ArcDetailComponent), 
    canActivate: [loggedInGuard] 
  },
  { path: '**', redirectTo: '/' } // Catch-all route
];
