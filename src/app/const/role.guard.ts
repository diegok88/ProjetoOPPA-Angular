import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const perfil = authService.getPerfil();
  if (perfil) {
    const permissao = route.data['roles'] as string[] | undefined;
    if (!permissao || permissao.length === 0) return true;

    const usuarioPerfil = authService.getRole();
    if (usuarioPerfil && permissao.includes(usuarioPerfil)) return true;

    router.navigate(['/login']);
    return false;
  }
  return authService.obterPerfil().pipe(
    map(() => {
      const permissao = route.data['roles'] as string[] | undefined;
      if (!permissao || permissao.length === 0) return true;

      const usuarioPerfil = authService.getRole();
      if (usuarioPerfil && permissao.includes(usuarioPerfil)) return true;

      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    }),
  );
};
