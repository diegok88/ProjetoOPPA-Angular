import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Contador } from '../interfaces/counter.interface';
import { SolucoesModel, SolucoesForm } from '../entities/solucoes.model';

@Injectable({
  providedIn: 'root',
})
export class SolucoesService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.solucoes;

  private listarSolucoesSignal = signal<SolucoesModel[] | []>([]);
  public listarSolucoes = this.listarSolucoesSignal.asReadonly();

  private buscarSolucoesSignal = signal<SolucoesModel | null>(null);
  public buscarSolucao = this.buscarSolucoesSignal.asReadonly();

  private contadorSolucoesSignal = signal<Contador | null>(null);
  public contadorSolucoes = this.contadorSolucoesSignal.asReadonly();

  cadastrar(dados: SolucoesForm): Observable<SolucoesModel> {
    return this.http.post<SolucoesModel>(this.apiUrl, dados);
  }
  atualizar(id: string, dados: SolucoesForm): Observable<SolucoesModel> {
    return this.http.patch<SolucoesModel>(`${this.apiUrl}/${id}`, dados);
  }
  ativar(id: string): Observable<SolucoesModel> {
    return this.http.patch<SolucoesModel>(`${this.apiUrl}/active/${id}`, {});
  }
  inativar(id: string): Observable<SolucoesModel> {
    return this.http.patch<SolucoesModel>(
      `${this.apiUrl}/deactive/${id}`,
      {},
    );
  }
  deletar(id: string): Observable<SolucoesModel> {
    return this.http.delete<SolucoesModel>(`${this.apiUrl}/${id}`);
  }
  listar(query?: string): Observable<SolucoesModel[]> {
    return this.http.get<SolucoesModel[]>(`${this.apiUrl}?${query}`).pipe(
      tap((dados) => {
        this.listarSolucoesSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  buscar(id: string): Observable<SolucoesModel> {
    return this.http.get<SolucoesModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarSolucoesSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  counter(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter`).pipe(
      tap((dado) => {
        this.contadorSolucoesSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  public limparBuscar() {
    this.buscarSolucoesSignal.set(null);
    this.listarSolucoesSignal.set([]);
    this.contadorSolucoesSignal.set(null);
  }
}