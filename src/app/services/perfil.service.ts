import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RequestHttp } from '../const/requests.const';
import { PerfilData } from '../interfaces/perfil-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.perfil;

  private perfilSignal = signal<PerfilData[] | []>([]);
  public perfil = this.perfilSignal.asReadonly();

  listar(): void {
    this.http.get<PerfilData[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.perfilSignal.set(dados);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
