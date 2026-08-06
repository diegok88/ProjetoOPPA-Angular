import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginData } from '../../interfaces/login-data.interface';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../interfaces/auth-response.interface';
import { UserGuard } from '../../interfaces/user-guard.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';
  private perfilSignal: UserGuard | null = null;
  private perfilAtual: string | null = null;

  login(credencial: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credencial);
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => (this.perfilCache = null)));
  }

  obterPerfil(): Observable<UserGuard> {
    return this.http
      .get<UserGuard>(`${this.apiUrl}/profile`)
      .pipe(tap((usuario) => (this.perfilCache = usuario)));
  }

  setRole(perfil: string) {
    this.perfilAtual = perfil;
  }

  getRole(): string | null {
    return this.perfilAtual;
  }

  isLoggedIn(): boolean {
    return this.perfilAtual !== null;
  }
}
