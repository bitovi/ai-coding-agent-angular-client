import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { catchError, map, of } from 'rxjs';

import { UserService } from '../services/user/user';

const isAuthenticated = (r: any) => !!r && r.success === true;

export const authGuard: CanActivateFn = () => {
  const user = inject(UserService);
  const router = inject(Router);

  return user.getUser().pipe(
    map((res) =>
      isAuthenticated(res) ? true : router.createUrlTree(['/auth', 'login'])
    ),
    catchError(() => of(router.createUrlTree(['/auth', 'login'])))
  );
};
