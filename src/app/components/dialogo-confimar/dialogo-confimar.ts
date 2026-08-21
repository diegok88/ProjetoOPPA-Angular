import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DialogoConfirmarData } from '../../interfaces/dialogo-confirmar.interface';

@Component({
  selector: 'app-dialogo-confimar',
  imports: [],
  templateUrl: './dialogo-confimar.html',
  styleUrl: './dialogo-confimar.scss',
})
export class DialogoConfimar {
  public data = inject<DialogoConfirmarData>(DIALOG_DATA);

  private dialogRef = inject(DialogRef<boolean>);

  public carregando = signal<boolean>(false);
  private erroSignal = signal<string[] | null>(null);
  public erroMensagem = this.erroSignal.asReadonly();

  async onConfirmar() {
    this.carregando.set(true);
    this.erroSignal.set(null);

    try {
      const acaoFn = this.data.acao();
      let resultado: any;

      if (acaoFn instanceof Promise) {
        resultado = await acaoFn;
      } else {
        resultado = await firstValueFrom(acaoFn);
      }

      this.carregando.set(false);
      this.dialogRef.close(true);
    } catch (error: any) {
      this.carregando.set(false);

      if (Array.isArray(error)) {
        this.erroSignal.set(error);
      } else if (typeof error === 'string') {
        this.erroSignal.set([error]);
      } else {
        this.erroSignal.set(['Erro inesperado.']);
      }
    }
  }

  public fecharModal(confirmado: boolean) {
    if (this.carregando()) return;
    this.dialogRef.close(confirmado);
  }
}

/*
script html
@if (erro()) {
      @for (item of erro(); track item) {
        <div class="alert-error">⚠️ {{ item }}</div>
      }
    }
*/
