import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RequestHttp } from '../const/requests.const';
import { PerfilData } from '../interfaces/perfil-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.perfil;

  private perfilSignal = signal<PerfilData[] | []>([]);
  public perfil = this.perfilSignal.asReadonly();

  cadastrar(dados: PerfilData): Observable<PerfilData> {
    return this.http.post<PerfilData>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: PerfilData): Observable<PerfilData> {
    return this.http.patch<PerfilData>(`${this.apiUrl}/${id}`, dados);
  }

  inativar(id: string): Observable<PerfilData> {
    return this.http.patch<PerfilData>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<PerfilData> {
    return this.http.delete<PerfilData>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<PerfilData[]> {
    return this.http.get<PerfilData[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.perfilSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
