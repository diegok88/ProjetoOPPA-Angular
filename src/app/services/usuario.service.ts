import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Contador } from '../interfaces/counter.interface';
import { UsuarioModel } from '../entities/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.usuario;

  private listarUsuarioSignal = signal<UsuarioModel[] | []>([]);
  public listarUsuario = this.listarUsuarioSignal.asReadonly();

  private buscarUsuarioSignal = signal<UsuarioModel | null>(null);
  public buscarUsuario = this.buscarUsuarioSignal.asReadonly();

  private contadorUsuarioSignal = signal<Contador | null>(null);
  public contadorUsuario = this.contadorUsuarioSignal.asReadonly();

  cadastrar(dados: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.apiUrl}`, dados);
  }
  atualizar(id: string, dados: UsuarioModel): Observable<UsuarioModel> {
    return this.http.patch<UsuarioModel>(`${this.apiUrl}/${id}`, dados);
  }
  ativar(id: string): Observable<UsuarioModel> {
    return this.http.patch<UsuarioModel>(`${this.apiUrl}/active/${id}`, {});
  }
  inativar(id: string): Observable<UsuarioModel> {
    return this.http.patch<UsuarioModel>(`${this.apiUrl}/deactive/${id}`, {});
  }
  deletar(id: string): Observable<UsuarioModel> {
    return this.http.delete<UsuarioModel>(`${this.apiUrl}/${id}`);
  }
  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.listarUsuarioSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS */
  listarTabela(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrl}/list`).pipe(
      tap((dados) => {
        this.listarUsuarioSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS UNICO SOLICITADO */
  buscar(id: string): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarUsuarioSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* CONTADOR DE REGISTROS TOTAIS, ATIVOS E INATIVOS */
  counter(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter`).pipe(
      tap((dado) => {
        this.contadorUsuarioSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarUsuarioSignal.set(null);
    this.listarUsuarioSignal.set([]);
    this.contadorUsuarioSignal.set(null);
  }
}
