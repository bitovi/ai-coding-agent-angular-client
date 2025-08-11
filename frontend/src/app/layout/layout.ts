import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/services/auth/auth';
import { UserService } from '../core/services/user/user';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  #userService = inject(UserService);
  #authService = inject(AuthService);
  #router = inject(Router);

  user = this.#userService.user;

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/auth', 'login']);
  }
}
