import { Component, inject, signal } from '@angular/core';
import { DialogoConfirmarData } from '../../interfaces/dialogo-confirmar.interface';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';

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
  public erro = signal<string[] | null>(null);

  async onConfirmar() {
    this.carregando.set(true);
    this.erro.set(null);

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
        this.erro.set(error);
      } else if (typeof error === 'string') {
        this.erro.set([error]);
      } else {
        this.erro.set(['Erro inesperado.']);
      }
    }
  }

  public fecharModal(confirmado: boolean) {
    if (this.carregando()) return;
    this.dialogRef.close(confirmado);
  }
}
