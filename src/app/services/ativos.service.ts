import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { Contador } from '../interfaces/counter.interface';
import { AtivosModel } from '../entities/ativos.model';

@Injectable({
  providedIn: 'root',
})
export class AtivosService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.ativos;

  private listarAtivosSignal = signal<AtivosModel[] | []>([]);
  public listarAtivos = this.listarAtivosSignal.asReadonly();

  private buscarAtivosSignal = signal<AtivosModel | null>(null);
  public buscarAtivo = this.buscarAtivosSignal.asReadonly();

  private contadorAtivosSignal = signal<Contador | null>(null);
  public contadorAtivos = this.contadorAtivosSignal.asReadonly();

  cadastrar(dados: AtivosModel): Observable<AtivosModel> {
    return this.http.post<AtivosModel>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: AtivosModel): Observable<AtivosModel> {
    return this.http.patch<AtivosModel>(`${this.apiUrl}/${id}`, dados);
  }

  ativar(id: string): Observable<AtivosModel> {
    return this.http.patch<AtivosModel>(`${this.apiUrl}/active/${id}`, {});
  }

  inativar(id: string): Observable<AtivosModel> {
    return this.http.patch<AtivosModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<AtivosModel> {
    return this.http.delete<AtivosModel>(`${this.apiUrl}/${id}`);
  }

  listar(query?: string): Observable<AtivosModel[]> {
    return this.http.get<AtivosModel[]>(`${this.apiUrl}?${query}`).pipe(
      tap((dados) => {
        this.listarAtivosSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADO UNICO SOLICITADO */
  buscar(id: string): Observable<AtivosModel> {
    return this.http.get<AtivosModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarAtivosSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /*
  CONTADOR DE REGISTROS:
  - Recebe dados do back-end
  - Os dados totais, ativos e inativos.
  - Apenas para Assistência.
  */
  counter(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter`).pipe(
      tap((dado) => {
        this.contadorAtivosSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarAtivosSignal.set(null);
    this.listarAtivosSignal.set([]);
    this.contadorAtivosSignal.set(null);
  }
}
