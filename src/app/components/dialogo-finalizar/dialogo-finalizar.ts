import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogoFinalizarData } from '../../entities/dialogo-finalizar.model';

@Component({
  selector: 'app-dialogo-finalizar',
  imports: [],
  templateUrl: './dialogo-finalizar.html',
  styleUrl: './dialogo-finalizar.scss',
})
export class DialogoFinalizar {
  public data = inject<DialogoFinalizarData>(DIALOG_DATA);
  private dialogRef = inject(DialogRef<boolean>);

  fechar(): void {
    this.dialogRef.close();
  }
}
