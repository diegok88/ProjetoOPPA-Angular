import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogoFinalizar } from '../components/dialogo-finalizar/dialogo-finalizar';

@Injectable({
  providedIn: 'root',
})
export class DialogFinalizarService {
  private dialog = inject(Dialog);

  finalizar(config: {
    icone: string;
    titulo: string;
    operacao: string;
    mensagem: string;
    erros?: string[];
  }): Observable<void> {
    const dialogRef = this.dialog.open(DialogoFinalizar, {
      data: {
        icone: config.icone,
        titulo: config.titulo,
        operacao: config.operacao,
        mensagem: config.mensagem,
        erros: config.erros,
      },
      disableClose: true,
    });
    return dialogRef.closed as Observable<void>;
  }
}
