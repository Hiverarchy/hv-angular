import { Injectable } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';

@Injectable({
  providedIn: 'root'
})
export class BaseStateService<T> {
  protected store = signalStore(
    withState<T>({} as T),
    withMethods(({ state }) => ({
      set: (newState: Partial<T>) => patchState(state, newState),
      select: <K extends keyof T>(selector: (state: T) => T[K]) => selector(state())
    })),
    { providedIn: 'root' }
  );

  constructor(initialState: T) {
    this.store.set(initialState);
  }
}