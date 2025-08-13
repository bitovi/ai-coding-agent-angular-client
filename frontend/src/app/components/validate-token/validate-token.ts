import { CommonModule } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, map, of, take } from 'rxjs';

import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-validate-token',
  templateUrl: './validate-token.html',
  styleUrls: ['./validate-token.scss'],
  imports: [CommonModule, FormsModule],
})
export class ValidateToken {
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #http = inject(HttpClient);

  token = '';

  validationResponse =
    this.#authService.tokenValidationState.response.asReadonly();

  expired = computed(() => this.validationResponse() === 'EXPIRED');

  loading = computed(() => this.#authService.tokenValidationState.loading());

  error = computed(() => {
    return this.#authService.tokenValidationState.error();
  });

  constructor() {
    effect(() => {
      const tokenValidation = this.#authService.tokenValidationState.response();
      if (tokenValidation) {
        if (tokenValidation === 'VALID') {
          this.#router.navigate(['/dashboard']);
        }
      }
    });
  }

  onSubmit(): void {
    this.#authService.validateToken(this.token);
  }

  backToEmail(): void {
    this.token = '';
    this.#router.navigate(['/login']);
    this.#authService.loginState.loginResponse.set(null);
  }
}
