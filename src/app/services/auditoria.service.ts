import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RequestHttp } from '../const/requests.const';
import { AuditoriaData } from '../interfaces/auditoria-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.auditoria;

  private auditoriaSignal = signal<AuditoriaData[] | []>([]);
  public auditoria = this.auditoriaSignal.asReadonly();

  listar(field?: string, query?: string): Observable<AuditoriaData[]> {
    return this.http.get<AuditoriaData[]>(`${this.apiUrl}?${field}=${query}`).pipe(
      tap((dados) => this.auditoriaSignal.set(dados)),
      catchError((error) => throwError(() => error)),
    );
  }
}
