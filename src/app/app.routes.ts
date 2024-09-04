import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { LoginComponent } from './components/login/login.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'new-post', component: NewPostComponent },
  { path: 'edit-post/:id', component: EditPostComponent },
];
