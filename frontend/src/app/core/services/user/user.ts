import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { take, tap } from 'rxjs';

import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #httpClient = inject(HttpClient);
  #user = signal<User | null>(null);

  user = this.#user.asReadonly();

  getUser() {
    return this.#httpClient.get<User>('/api/user').pipe(
      tap((user) => this.#user.set(user)),
      take(1)
    );
  }
}
