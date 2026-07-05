import { Routes } from '@angular/router';
import { DashboardAdmin } from './dashboard/dashboard-admin/dashboard-admin';

export const routes: Routes = [
  {
    path: 'dashboard-admin',
    component: DashboardAdmin,
  },
  {
    path: '',
    redirectTo: '/dashboard-admin',
    pathMatch: 'full',
  },
];
