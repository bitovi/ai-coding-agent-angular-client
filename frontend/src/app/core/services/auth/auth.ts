import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, catchError, finalize, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #service = inject(HttpClient);
  loginState = {
    loading: signal<boolean>(false),
    error: signal<string | null>(null),
    loginResponse: signal<string | null>(null),
  };

  login(email: string): void {
    this.loginState.loading.set(true);
    this.#service
      .post<{ message: string; token: string }>('/api/auth/request-login', {
        email,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.loginState.loading.set(false);
        }),
        catchError((err) => {
          this.loginState.error.set(
            err.error?.message || 'An error occurred during login.'
          );
          return EMPTY;
        })
      )
      .subscribe((response) => {
        this.loginState.loginResponse.set(response.message);
        this.loginState.error.set(null);
      });
  }

  logout(): void {
    this.#service
      .post('/api/auth/logout', {})
      .pipe(take(1))
      .subscribe(() => {
        this.loginState.loginResponse.set(null);
        this.loginState.error.set(null);
      });
  }
}
