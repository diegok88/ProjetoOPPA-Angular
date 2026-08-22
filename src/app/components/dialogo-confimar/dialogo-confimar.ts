import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DialogoConfirmarData } from '../../interfaces/dialogo-confirmar.interface';
import { DialogFinalizarService } from '../../services/dialog-finalizar.service';

@Component({
  selector: 'app-dialogo-confimar',
  imports: [],
  templateUrl: './dialogo-confimar.html',
  styleUrl: './dialogo-confimar.scss',
})
export class DialogoConfimar {
  public data = inject<DialogoConfirmarData>(DIALOG_DATA);

  private dialogRef = inject(DialogRef<string>);

  private finalizarService = inject(DialogFinalizarService);

  public carregando = signal<boolean>(false);
  private errosSignal = signal<string[]>([]);
  public erroMensagem = this.errosSignal.asReadonly();

  async onConfirmar() {
    this.carregando.set(true);
    this.errosSignal.set([]);
    this.finalizarService.limparErros();

    try {
      const acaoFn = this.data.acao();
      let resultado: any;

      if (acaoFn instanceof Promise) {
        resultado = await acaoFn;
      } else {
        resultado = await firstValueFrom(acaoFn);
      }

      this.carregando.set(false);
      this.dialogRef.close('finalizado');
    } catch (error: any) {
      this.carregando.set(false);

      if (Array.isArray(error)) {
        this.errosSignal.set(error);
      } else if (typeof error === 'string') {
        this.errosSignal.set([error]);
      } else {
        this.errosSignal.set(['Erro inesperado.']);
      }

      this.finalizarService.definirErros(this.erroMensagem());
      this.dialogRef.close('erro');
    }
  }

  public fecharModal(confirmado: string) {
    if (this.carregando()) return;
    this.dialogRef.close(confirmado);
  }
}
