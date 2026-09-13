import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../constants/requests.const';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { EmpresaModel } from '../entities/empresa.model';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.empresa;

  private empresaSignal = signal<EmpresaModel[] | []>([]);
  public empresa = this.empresaSignal.asReadonly();

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
        this.empresaSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
