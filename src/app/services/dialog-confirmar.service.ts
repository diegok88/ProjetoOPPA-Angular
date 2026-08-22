import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogoConfimar } from '../components/dialogo-confimar/dialogo-confimar';

@Injectable({
  providedIn: 'root',
})
export class DialogConfirmarService {
  private dialog = inject(Dialog);

  confirmar<T>(config: {
    icone: string;
    titulo: string;
    mensagem: string;
    acao: () => Observable<T> | Promise<T>;
  }): Observable<string> {
    const dialogRef = this.dialog.open<string>(DialogoConfimar, {
      data: {
        icone: config.icone,
        titulo: config.titulo,
        mensagem: config.mensagem,
        acao: config.acao,
      },
      disableClose: true,
    });
    return dialogRef.closed as Observable<string>;
  }
}
