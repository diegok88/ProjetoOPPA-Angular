import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { RequestHttp } from '../const/requests.const';
import { ROLES_MAP } from '../const/role-map.const';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { LoginData } from '../interfaces/login-data.interface';
import { UserGuard } from '../interfaces/user-guard.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.auth;
  private perfilSignal = signal<UserGuard | null>(null);

  public usuario = this.perfilSignal.asReadonly();

  public role = computed(() => {
    const perfil = this.perfilSignal();
    console.log(perfil);
    if (!perfil) {
      console.log('Não reconhece perfil!');
      return null;
    }
    return ROLES_MAP[perfil.desPerfil];
  });

  login(credencial: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credencial);
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => this.perfilSignal.set(null)));
  }

  obterPerfil(): Observable<UserGuard> {
    const cache = this.perfilSignal();
    if (cache) return of(cache);
    return this.http
      .get<UserGuard>(`${this.apiUrl}/profile`)
      .pipe(tap((usuario) => this.perfilSignal.set(usuario)));
  }

  getPerfil(): UserGuard | null {
    return this.perfilSignal();
  }

  getRole(): string | null {
    console.log(this.role());
    return this.role();
  }

  isLoggedIn(): boolean {
    return this.perfilSignal() !== null;
  }
}
