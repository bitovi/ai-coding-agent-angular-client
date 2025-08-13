import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, catchError, finalize, of, take } from 'rxjs';

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

  tokenValidationState = {
    loading: signal<boolean>(false),
    error: signal<string | null>(null),
    response: signal<'VALID' | 'EXPIRED' | null>(null),
  };

  login(email: string): void {
    this.loginState.loading.set(true);
    this.#service
      .post<{ message: string; token: string }>('/auth/request-login', {
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
      .post('/auth/logout', {})
      .pipe(take(1))
      .subscribe(() => {
        this.loginState.loginResponse.set(null);
        this.loginState.error.set(null);
      });
  }

  validateToken(token: string): void {
    this.tokenValidationState.loading.set(true);
    this.tokenValidationState.error.set(null);
    this.tokenValidationState.response.set(null);

    // Use a regular HTTP request that can handle redirects/non-JSON responses
    this.#service
      .get(`/auth/login?token=${token}`, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          // Handle different response scenarios
          if (error.status === 302 || error.status === 301) {
            // Server sent a redirect - this means token validation succeeded
            return of('redirect_success');
          } else if (error.status === 200) {
            // Successful response
            return of('success');
          } else {
            // Actual error
            this.tokenValidationState.error.set(
              error.error?.message || error.message || 'Token validation failed'
            );
            return of('error');
          }
        }),
        take(1)
      )
      .subscribe((response: any) => {
        this.tokenValidationState.loading.set(false);
        if (
          response === 'redirect_success' ||
          response === 'success' ||
          (typeof response === 'object' &&
            response?.status >= 200 &&
            response?.status < 400)
        ) {
          const url = new URL(response.url);
          const errorMsg = url.searchParams.get('error');
          if (errorMsg) {
            this.tokenValidationState.error.set(errorMsg);
            this.tokenValidationState.response.set('EXPIRED');
          } else {
            this.tokenValidationState.response.set('VALID');
          }
        }
      });
  }
}
