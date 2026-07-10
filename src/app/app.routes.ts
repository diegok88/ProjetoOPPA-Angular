import { Routes } from '@angular/router';
import { DashboardUser } from './modules/dashboard-user/dashboard-user';
import { LoginUser } from './modules/login-user/login-user';

export const routes: Routes = [
  {
    path: 'login-user',
    component: LoginUser,
  },
  {
    path: 'dashboard-user',
    component: DashboardUser,
  },
  {
    path: '',
    redirectTo: '/dashboard-user',
    pathMatch: 'full',
  },
];
