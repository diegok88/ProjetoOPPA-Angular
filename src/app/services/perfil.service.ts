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

  private listarPerfilSignal = signal<PerfilModel[] | []>([]);
  public listarPerfil = this.listarPerfilSignal.asReadonly();

  private buscarPerfilSignal = signal<PerfilModel | null>(null);
  public buscarPerfil = this.buscarPerfilSignal.asReadonly();

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

  /* LISTA TODOS OS DADOS CADASTRADOS */
  listar(): Observable<PerfilModel[]> {
    return this.http.get<PerfilModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.listarPerfilSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LISTA OS DADOS APENAS PARA A TABELA */
  listarTabela(): Observable<PerfilModel[]> {
    return this.http.get<PerfilModel[]>(`${this.apiUrl}/list`).pipe(
      tap((dados) => {
        this.listarPerfilSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS UNICO SOLICITADO */
  buscar(id: string): Observable<PerfilModel> {
    return this.http.get<PerfilModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarPerfilSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  public limparBascar() {
    this.buscarPerfilSignal.set(null);
  }
}
