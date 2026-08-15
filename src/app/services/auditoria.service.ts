import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../const/requests.const';
import { AuditoriaData } from '../interfaces/auditoria-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.perfil;

  private auditoriaSignal = signal<AuditoriaData[] | []>([]);
  public auditoria = this.auditoriaSignal.asReadonly();

  listar(query?: AuditoriaData): void {
    const params = new HttpParams({ fromObject: query as any });
    this.http.get<AuditoriaData[]>(this.apiUrl, { params }).subscribe({
      next: (dados) => {
        this.auditoriaSignal.set(dados);
      },
      error: (err: any) => {
        alert('Falha ao carregar a lista de perfil.');
        console.error(err);
      },
    });
  }
}
