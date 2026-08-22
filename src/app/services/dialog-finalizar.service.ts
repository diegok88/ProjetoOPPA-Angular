import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogoFinalizar } from '../components/dialogo-finalizar/dialogo-finalizar';
import { DialogoFinalizarData } from '../interfaces/dialogo-finalizar.interface';

@Injectable({
  providedIn: 'root',
})
export class DialogFinalizarService {
  private dialog = inject(Dialog);

  private errosSignal = signal<string[]>([]);
  public ultimosErros = this.errosSignal.asReadonly();

  public definirErros(erros: string[]) {
    this.errosSignal.set(erros);
  }

  public limparErros() {
    this.errosSignal.set([]);
  }

  finalizar(config: DialogoFinalizarData): Observable<void> {
    const dialogRef = this.dialog.open(DialogoFinalizar, {
      data: {
        ...config,
        erros: config.erros ?? this.ultimosErros(),
      },
      disableClose: true,
    });
    return dialogRef.closed as Observable<void>;
  }
}
