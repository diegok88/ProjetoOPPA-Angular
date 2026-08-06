import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const permissoes = route.data['roles'] as string[];
    if (!permissoes || permissoes.length === 0) return true;

    const usuarioPerfil = this.auth.getRole();
    if (usuarioPerfil && permissoes.includes(usuarioPerfil)) return true;

    this.router.navigate(['/login']);
    return false;
  }
}
