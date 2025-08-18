import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  emailValue = '';

  loginResponse = this.#authService.loginState.loginResponse.asReadonly();

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
