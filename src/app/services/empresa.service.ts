import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { EmpresaModel } from '../entities/empresa.model';
import { Contador } from '../interfaces/counter.interface';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.empresa;

  private listarEmpresaSignal = signal<EmpresaModel[] | []>([]);
  public listarEmpresa = this.listarEmpresaSignal.asReadonly();

  private buscarEmpresaSignal = signal<EmpresaModel | null>(null);
  public buscarEmpresas = this.buscarEmpresaSignal.asReadonly();

  private contadorEmpresaSignal = signal<Contador | null>(null);
  public contadorEmpresa = this.contadorEmpresaSignal.asReadonly();

  private contadorEmpresaAdGeSignal = signal<Contador | null>(null);
  public contadorEmpresaAdGe = this.contadorEmpresaAdGeSignal.asReadonly();

  cadastrar(dados: EmpresaModel): Observable<EmpresaModel> {
    return this.http.post<EmpresaModel>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: EmpresaModel): Observable<EmpresaModel> {
    return this.http.patch<EmpresaModel>(`${this.apiUrl}/${id}`, dados);
  }

  ativar(id: string): Observable<EmpresaModel> {
    return this.http.patch<EmpresaModel>(`${this.apiUrl}/active/${id}`, {});
  }

  inativar(id: string): Observable<EmpresaModel> {
    return this.http.patch<EmpresaModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<EmpresaModel> {
    return this.http.delete<EmpresaModel>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<EmpresaModel[]> {
    return this.http.get<EmpresaModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.listarEmpresaSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS */
  listarTabela(): Observable<EmpresaModel[]> {
    return this.http.get<EmpresaModel[]>(`${this.apiUrl}/list`).pipe(
      tap((dados) => {
        this.listarEmpresaSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS UNICO SOLICITADO */
  buscar(id: string): Observable<EmpresaModel> {
    return this.http.get<EmpresaModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarEmpresaSignal.set(dado);
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
        this.contadorEmpresaSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /*
  CONTADOR DE REGISTROS:
  - Recebe dados do back-end
  - Os dados totais, ativos e inativos.
  - Apenas para Administradores e gestores.
  */
  counterCollaborators(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter_collaborators`).pipe(
      tap((dado) => {
        this.contadorEmpresaAdGeSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarEmpresaSignal.set(null);
    this.listarEmpresaSignal.set([]);
    this.contadorEmpresaSignal.set(null);
    this.contadorEmpresaAdGeSignal.set(null);
  }
}
