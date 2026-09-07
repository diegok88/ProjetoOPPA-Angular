import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RequestHttp } from '../constants/requests.const';
import { PerfilModel } from '../entities/perfil.model';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.perfil;

  private perfilSignal = signal<PerfilModel[] | []>([]);
  public perfil = this.perfilSignal.asReadonly();

  cadastrar(dados: PerfilModel): Observable<PerfilModel> {
    return this.http.post<PerfilModel>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: PerfilModel): Observable<PerfilModel> {
    return this.http.patch<PerfilModel>(`${this.apiUrl}/${id}`, dados);
  }

  inativar(id: string): Observable<PerfilModel> {
    return this.http.patch<PerfilModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  ativar(id: string): Observable<PerfilModel> {
    return this.http.patch<PerfilModel>(`${this.apiUrl}/active/${id}`, {});
  }

  deletar(id: string): Observable<PerfilModel> {
    return this.http.delete<PerfilModel>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<PerfilModel[]> {
    return this.http.get<PerfilModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.perfilSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
