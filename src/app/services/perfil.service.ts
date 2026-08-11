import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttp } from '../const/requests.const';
import { PerfilData } from '../interfaces/perfil-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = RequestHttp.perfil;

  private perfilSignal = signal<PerfilData | []>([]);
  public perfil = this.perfilSignal.asReadonly();

  listar(): Observable<PerfilData[]> {
    return this.http.get<PerfilData[]>(this.apiUrl);
  }
}
