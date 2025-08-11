import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { catchError, map, of } from 'rxjs';

import { UserService } from '../services/user/user';

const isAuthenticated = (r: any) => !!r && r.success === true;

export const redirectIfLoggedInGuard: CanMatchFn = () => {
  const user = inject(UserService);
  const router = inject(Router);

  return user.getUser().pipe(
    map((res) =>
      isAuthenticated(res) ? router.createUrlTree(['/dashboard']) : true
    ),
    catchError(() => {
      return of(true);
    })
  );
};
