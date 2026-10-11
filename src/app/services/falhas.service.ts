import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Contador } from '../interfaces/counter.interface';
import { FalhasModel, FalhasForm } from '../entities/falhas.model';

@Injectable({
  providedIn: 'root',
})
export class FalhasService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.falhas;

  private listarFalhasSignal = signal<FalhasModel[] | []>([]);
  public listarFalhas = this.listarFalhasSignal.asReadonly();

  private buscarFalhasSignal = signal<FalhasModel | null>(null);
  public buscarFalha = this.buscarFalhasSignal.asReadonly();

  private contadorFalhasSignal = signal<Contador | null>(null);
  public contadorFalhas = this.contadorFalhasSignal.asReadonly();

  cadastrar(dados: FalhasForm): Observable<FalhasModel> {
    return this.http.post<FalhasModel>(this.apiUrl, dados);
  }
  atualizar(id: string, dados: FalhasForm): Observable<FalhasModel> {
    return this.http.patch<FalhasModel>(`${this.apiUrl}/${id}`, dados);
  }
  ativar(id: string): Observable<FalhasModel> {
    return this.http.patch<FalhasModel>(`${this.apiUrl}/active/${id}`, {});
  }
  inativar(id: string): Observable<FalhasModel> {
    return this.http.patch<FalhasModel>(`${this.apiUrl}/deactive/${id}`, {});
  }
  deletar(id: string): Observable<FalhasModel> {
    return this.http.delete<FalhasModel>(`${this.apiUrl}/${id}`);
  }
  listar(query?: string): Observable<FalhasModel[]> {
    return this.http.get<FalhasModel[]>(`${this.apiUrl}?${query}`).pipe(
      tap((dados) => {
        this.listarFalhasSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  /* BUSCA O DADO UNICO SOLICITADO */
  buscar(id: string): Observable<FalhasModel> {
    return this.http.get<FalhasModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarFalhasSignal.set(dado);
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
        this.contadorFalhasSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarFalhasSignal.set(null);
    this.listarFalhasSignal.set([]);
    this.contadorFalhasSignal.set(null);
  }
}
