import { Routes } from '@angular/router';
import { roleGuard } from './const/role.guard';
import { AccessDenied } from './modules/access-denied/access-denied';
import { DashboardUser } from './modules/dashboard-user/dashboard-user';
import { LoginUser } from './modules/login-user/login-user';
import { DialogoConfimar } from './components/dialogo-confimar/dialogo-confimar';

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
        data: { roles: ['ASSISTÊNCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'] },
      },
      {
        path: 'perfil',
        loadComponent: () => import('./components/perfil/perfil').then((m) => m.Perfil),
        canActivate: [roleGuard],
        data: { roles: ['ASSISTÊNCIA - NIVEL 1'] },
      },
      {
        path: 'empresa',
        loadComponent: () => import('./components/empresa/empresa').then((m) => m.Empresa),
        canActivate: [roleGuard],
        data: { roles: ['ASSISTÊNCIA - NIVEL 1'] },
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
  { path: '', redirectTo: '/login-user', pathMatch: 'full' },
  { path: '**', redirectTo: '/login-user' },
];
/*
    
*/
