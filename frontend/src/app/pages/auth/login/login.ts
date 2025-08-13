import { CommonModule } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, map, of, take } from 'rxjs';

import { ValidateToken } from '../../../components/validate-token/validate-token';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ValidateToken],
})
export class Login {
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);

  emailValue = '';

  loginResponse = this.#authService.loginState.loginResponse.asReadonly();

  validationErrorParam = toSignal(
    this.#route.queryParamMap.pipe(map((params) => params.get('error'))),
    { initialValue: '' }
  );

  loading = computed(() => this.#authService.loginState.loading());

  error = computed(() => this.#authService.loginState.error());

  onSubmit(): void {
    this.login(this.emailValue);
  }

  login(email: string): void {
    this.#authService.login(email);
    this.emailValue = '';
  }
}
