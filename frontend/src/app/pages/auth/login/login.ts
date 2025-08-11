import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule],
})
export class Login {
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  emailValue = '';

  loginResponse = this.#authService.loginState.loginResponse.asReadonly();

  tokenParam = toSignal(
    this.#route.queryParamMap.pipe(map((params) => params.get('token'))),
    { initialValue: '' }
  );

  validationErrorParam = toSignal(
    this.#route.queryParamMap.pipe(map((params) => params.get('error'))),
    { initialValue: '' }
  );

  loading = computed(() => this.#authService.loginState.loading());

  error = computed(() => {
    return (
      this.#authService.loginState.error() ||
      this.tokenValidationRef.error()?.message
    );
  });

  tokenValidationRef = httpResource(() => {
    const token = this.tokenParam();
    if (!token) {
      return undefined;
    }

    return `/api/auth/login?token=${token}`;
  });

  constructor() {
    effect(() => {
      const validationResult = this.tokenValidationRef.value();
      // If the token is valid, navigate to the dashboard
      if (validationResult) {
        this.#router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    this.login(this.emailValue);
  }

  login(email: string): void {
    this.#authService.login(email);
  }
}
