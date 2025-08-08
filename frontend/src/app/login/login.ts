import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EMPTY, catchError, take, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class Login {
  #service = inject(HttpClient);

  emailValue = '';
  loginResponse = signal<string | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.login(this.emailValue);
    }
  }

  login(email: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.loginResponse.set(null);

    this.#service
      .post<{ message: string; token: string }>('/auth/request-login', {
        email,
      })
      .pipe(
        take(1),
        tap(() => {
          this.loading.set(false);
        }),
        catchError((err) => {
          this.error.set(
            err.error?.message || 'An error occurred during login.'
          );
          return EMPTY;
        })
      )
      .subscribe((response) => {
        this.loginResponse.set(response.message);
        sessionStorage.setItem('loginToken', response.token);
        console.log('Login token stored in sessionStorage:', response.token);
        this.loading.set(false);
      });
  }
}
