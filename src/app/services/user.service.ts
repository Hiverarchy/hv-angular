import { Injectable, computed } from '@angular/core';
import { BaseStateService } from './base-state.service';

interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseStateService<UserState> {
  constructor() {
    super({ name: '', email: '', isLoggedIn: false });
  }

  readonly name = this.store.select((state) => state.name);
  readonly email = this.store.select((state) => state.email);
  readonly isLoggedIn = this.store.select((state) => state.isLoggedIn);

  readonly displayName = computed(() => {
    const name = this.name();
    return name ? name : 'Guest';
  });

  login(name: string, email: string) {
    this.store.set({ name, email, isLoggedIn: true });
  }

  logout() {
    this.store.set({ name: '', email: '', isLoggedIn: false });
  }
}