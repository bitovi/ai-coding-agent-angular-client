import { Routes } from '@angular/router';

import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../app/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
];
