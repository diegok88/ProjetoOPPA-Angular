import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { Contador } from '../interfaces/counter.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CompetenciaSetorialModel } from '../entities/competencia-setorial.model';
import { SetoresModel } from '../entities/setores.model';

@Injectable({
  providedIn: 'root',
})
export class CompetenciaSetorialService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.competencia_setorial;

  private listarCompSetSignal = signal<CompetenciaSetorialModel[] | []>([]);
  public listarCompetenciaSetorial = this.listarCompSetSignal.asReadonly();

  private listarCompSetSetoresSignal = signal<SetoresModel[] | []>([]);
  public listarCompetenciaSetorialSetores = this.listarCompSetSetoresSignal.asReadonly();

  private contadorCompSetSignal = signal<Contador | null>(null);
  public contadorCompetenciaSetorial = this.contadorCompSetSignal.asReadonly();

  /* CADASTRO DA ENTIDADE */
  cadastrar(dados: CompetenciaSetorialModel): Observable<CompetenciaSetorialModel> {
    return this.http.post<CompetenciaSetorialModel>(this.apiUrl, dados);
  }

  inativar(id: string): Observable<CompetenciaSetorialModel> {
    return this.http.patch<CompetenciaSetorialModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  /* BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS */
  listarTabela(id: string): Observable<CompetenciaSetorialModel[]> {
    return this.http.get<CompetenciaSetorialModel[]>(`${this.apiUrl}/list/${id}`).pipe(
      tap((dados) => {
        this.listarCompSetSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* 
  BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS:
  - usado nas entidades competência setorial e ativos. 
  */
  listarSetores(id: string): Observable<SetoresModel[]> {
    return this.http.get<SetoresModel[]>(`${this.apiUrl}/section_available/${id}`).pipe(
      tap((dados) => {
        this.listarCompSetSetoresSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* CONTADOR DE REGISTROS TOTAIS, ATIVOS E INATIVOS */
  counter(): Observable<Contador> {
    return this.http.get<Contador>(`${this.apiUrl}/counter`).pipe(
      tap((dado) => {
        console.log(dado);
        this.contadorCompSetSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.contadorCompSetSignal.set(null);
  }
}
