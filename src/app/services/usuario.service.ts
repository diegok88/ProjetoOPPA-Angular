import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../const/requests.const';
import { UsuarioData } from '../interfaces/usuario-data.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.usuario;

  private usuarioSignal = signal<UsuarioData[] | []>([]);
  public usuario = this.usuarioSignal.asReadonly();

  cadastrarAssist(dados: UsuarioData): Observable<UsuarioData> {
    return this.http.post<UsuarioData>(`${this.apiUrl}/assist`, dados);
  }
  atualizar(id: string, dados: UsuarioData): Observable<UsuarioData> {
    return this.http.patch<UsuarioData>(`${this.apiUrl}/${id}`, dados);
  }
  inativar(id: string): Observable<UsuarioData> {
    return this.http.patch<UsuarioData>(`${this.apiUrl}/deactive/${id}`, {});
  }
  deletar(id: string): Observable<UsuarioData> {
    return this.http.delete<UsuarioData>(`${this.apiUrl}/${id}`);
  }
  listarAssist(): Observable<UsuarioData[]> {
    return this.http.get<UsuarioData[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.usuarioSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
