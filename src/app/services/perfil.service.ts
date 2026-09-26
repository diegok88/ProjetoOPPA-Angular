import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RequestHttp } from '../constants/requests.const';
import { PerfilModel } from '../entities/perfil.model';
import { Contador } from '../interfaces/counter.interface';

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

  private contadorPerfilSignal = signal<Contador | null>(null);
  public contadorPerfil = this.contadorPerfilSignal.asReadonly();

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

  /* BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS */
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

  /* CONTADOR DE REGISTROS TOTAIS, ATIVOS E INATIVOS */
  counter(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter`).pipe(
      tap((dado) => {
        this.contadorPerfilSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarPerfilSignal.set(null);
    this.listarPerfilSignal.set([]);
    this.contadorPerfilSignal.set(null);
  }
}
