import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const perfil = authService.getPerfil();
  if (!perfil) {
    router.navigate(['/login-user']);
    return false;
  }
  const permissao = route.data['roles'] as string[] | undefined;
  if (!permissao || permissao.length === 0) return true;

  const usuarioPerfil = authService.getRole();
  if (usuarioPerfil && permissao.includes(usuarioPerfil)) return true;

  router.navigate(['/access-denied']);
  return false;
};
