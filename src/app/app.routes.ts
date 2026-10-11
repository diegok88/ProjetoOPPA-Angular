import { Routes } from '@angular/router';
import { roleGuard } from './constants/role.guard';
import { AccessDenied } from './modules/access-denied/access-denied';
import { DashboardUser } from './modules/dashboard-user/dashboard-user';
import { LoginUser } from './modules/login-user/login-user';
import { ROLES_MAP } from './constants/role-map.const';

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
        loadComponent: () => import('./components/principal/principal').then((p) => p.Principal),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1, ROLES_MAP.GEN1] },
      },
      {
        path: 'usuario',
        loadComponent: () => import('./components/usuario/usuario').then((u) => u.Usuario),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1, ROLES_MAP.GEN1] },
      },
      {
        path: 'perfil',
        loadComponent: () => import('./components/perfil/perfil').then((p) => p.Perfil),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1] },
      },
      {
        path: 'empresa',
        loadComponent: () => import('./components/empresa/empresa').then((e) => e.Empresa),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'setores',
        loadComponent: () => import('./components/setores/setores').then((s) => s.Setores),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'competencia-setorial',
        loadComponent: () =>
          import('./components/competencia-setorial/competencia-setorial').then(
            (c) => c.CompetenciaSetorial,
          ),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },

      //  ATIVOS
      {
        path: 'ativos',
        loadComponent: () => import('./components/ativos/ativos').then((a) => a.Ativos),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'tag-ativo',
        loadComponent: () => import('./components/tag-ativo/tag-ativo').then((t) => t.TagAtivo),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'falhas',
        loadComponent: () => import('./components/falhas/falhas').then((f) => f.Falhas),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'solucoes',
        loadComponent: () => import('./components/solucoes/solucoes').then((s) => s.Solucoes),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },

      //  USUÁRIOS
      {
        path: 'informacoes',
        loadComponent: () =>
          import('./components/informacoes/informacoes').then((i) => i.Informacoes),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'trocar-senha',
        loadComponent: () =>
          import('./components/trocar-senha/trocar-senha').then((t) => t.TrocarSenha),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
      },
      {
        path: 'trocar-pin',
        loadComponent: () => import('./components/trocar-pin/trocar-pin').then((t) => t.TrocarPin),
        canActivate: [roleGuard],
        data: { roles: [ROLES_MAP.ASN1, ROLES_MAP.ADN1] },
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
