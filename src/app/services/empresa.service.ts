import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../const/requests.const';
import { EmpresaData } from '../interfaces/empresa-data.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.empresa;

  private empresaSignal = signal<EmpresaData[] | []>([]);
  public empresa = this.empresaSignal.asReadonly();

  cadastrar(dados: EmpresaData): Observable<EmpresaData> {
    return this.http.post<EmpresaData>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: EmpresaData): Observable<EmpresaData> {
    return this.http.patch<EmpresaData>(`${this.apiUrl}/${id}`, dados);
  }

  inativar(id: string): Observable<EmpresaData> {
    return this.http.patch<EmpresaData>(`${this.apiUrl}/deactive/${id}`, {});
  }

  deletar(id: string): Observable<EmpresaData> {
    return this.http.delete<EmpresaData>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<EmpresaData[]> {
    return this.http.get<EmpresaData[]>(this.apiUrl).pipe(
      tap((dados) => {
        this.empresaSignal.set(dados);
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
