import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { Contador } from '../interfaces/counter.interface';
import { TagAtivosForm, TagAtivosModel } from '../entities/tag-ativo.model';

@Injectable({
  providedIn: 'root',
})
export class TagAtivosService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.tag_ativo;

  private listarTagAtivosSignal = signal<TagAtivosModel[] | []>([]);
  public listarTagAtivos = this.listarTagAtivosSignal.asReadonly();

  private buscarTagAtivosSignal = signal<TagAtivosModel | null>(null);
  public buscarTagAtivo = this.buscarTagAtivosSignal.asReadonly();

  private contadorTagAtivosSignal = signal<Contador | null>(null);
  public contadorTagAtivos = this.contadorTagAtivosSignal.asReadonly();

  cadastrar(dados: TagAtivosForm): Observable<TagAtivosModel> {
    return this.http.post<TagAtivosModel>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: TagAtivosForm): Observable<TagAtivosModel> {
    return this.http.patch<TagAtivosModel>(`${this.apiUrl}/${id}`, dados);
  }

  ativar(id: string): Observable<TagAtivosModel> {
    return this.http.patch<TagAtivosModel>(`${this.apiUrl}/active/${id}`, {}); 
  }

  inativar(id: string): Observable<TagAtivosModel> {
    return this.http.patch<TagAtivosModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<TagAtivosModel> {
    return this.http.delete<TagAtivosModel>(`${this.apiUrl}/${id}`);
  }

  listar(query?: string): Observable<TagAtivosModel[]> {
    return this.http.get<TagAtivosModel[]>(`${this.apiUrl}?${query}`).pipe(
      tap((dados) => {
        this.listarTagAtivosSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADO UNICO SOLICITADO */
  buscar(id: string): Observable<TagAtivosModel> {
    return this.http.get<TagAtivosModel>(`${this.apiUrl}/${id}`).pipe( 
      tap((dado) => {
        this.buscarTagAtivosSignal.set(dado);
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
        this.contadorTagAtivosSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.buscarTagAtivosSignal.set(null);
    this.listarTagAtivosSignal.set([]);
    this.contadorTagAtivosSignal.set(null);
  }
}
