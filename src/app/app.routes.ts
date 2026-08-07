import { Routes } from '@angular/router';
import { roleGuard } from './const/role.guard';
import { DashboardUser } from './modules/dashboard-user/dashboard-user';
import { LoginUser } from './modules/login-user/login-user';
import { AccessDenied } from './modules/access-denied/access-denied';

export const routes: Routes = [
  {
    path: 'login-user',
    component: LoginUser,
  },
  {
    path: 'dashboard-user',
    component: DashboardUser,
    canActivate: [roleGuard],
    children: [
      {
        path: 'principal',
        loadComponent: () => import('./components/principal/principal').then((m) => m.Principal),
        canActivate: [roleGuard],
        data: { roles: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'] },
      },
      //  Adicione aqui as outras subrotas declaradas no MenuService
      {
        path: '',
        redirectTo: 'principal',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'access-denied',
    component: AccessDenied,
  },
  { path: '', redirectTo: '/dashboard-user', pathMatch: 'full' },
  { path: '**', redirectTo: '/login-user' },
];
/*
    
*/
