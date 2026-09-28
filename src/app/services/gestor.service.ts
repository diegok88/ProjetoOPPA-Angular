import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GestorModel } from '../entities/gestor.model';

@Injectable({
  providedIn: 'root',
})
export class GestorService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.gestor;

  private listarGestorSignal = signal<GestorModel[] | []>([]);
  public listarGestor = this.listarGestorSignal.asReadonly();

  /* BUSCA O DADOS PARA A TABELA COM APENAS DADOS NECESSARIOS */
  listarTabela(): Observable<GestorModel[]> {
    return this.http.get<GestorModel[]>(`${this.apiUrl}/list`).pipe(
      tap((dados) => {
        this.listarGestorSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /* LIMPEZA DOS SIGNALS DE LISTAR E BUSCAR */
  public limparBuscar() {
    this.listarGestorSignal.set([]);
  }
}
