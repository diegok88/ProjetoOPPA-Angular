import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { SetoresModel } from '../entities/setores.model';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetoresService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.setores;

  private listarSetoresSignal = signal<SetoresModel[] | []>([]);
  public listarSetores = this.listarSetoresSignal.asReadonly();

  private buscarSetoresSignal = signal<SetoresModel | null>(null);
  public buscarSetores = this.buscarSetoresSignal.asReadonly();

  cadastrar(dados: SetoresModel): Observable<SetoresModel> {
    return this.http.post<SetoresModel>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: SetoresModel): Observable<SetoresModel> {
    return this.http.patch<SetoresModel>(`${this.apiUrl}/${id}`, dados);
  }

  ativar(id: string): Observable<SetoresModel> {
    return this.http.patch<SetoresModel>(`${this.apiUrl}/active/${id}`, {});
  }

  inativar(id: string): Observable<SetoresModel> {
    return this.http.patch<SetoresModel>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<SetoresModel> {
    return this.http.delete<SetoresModel>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<SetoresModel[]> {
    return this.http.get<SetoresModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.listarSetoresSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  listarTabela(): Observable<SetoresModel[]> {
    return this.http.get<SetoresModel[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.listarSetoresSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* BUSCA O DADOS UNICO SOLICITADO */
  buscar(id: string): Observable<SetoresModel> {
    return this.http.get<SetoresModel>(`${this.apiUrl}/${id}`).pipe(
      tap((dado) => {
        this.buscarSetoresSignal.set(dado);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
