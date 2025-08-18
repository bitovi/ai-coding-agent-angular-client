import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { redirectIfLoggedInGuard } from './core/guards/redirect-if-logged-in-guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [redirectIfLoggedInGuard],
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'prompts/:promptName/activity',
        loadComponent: () =>
          import('./pages/prompt-activity/prompt-activity').then(
            (m) => m.PromptActivity
          ),
      },
    ],
  },
];
