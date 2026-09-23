import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { SetoresModel } from '../../../../entities/setores.model';

@Component({
  selector: 'app-inicial-setores',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-setores.html',
  styles: ``,
})
export class InicialSetores {
  public listar = input<SetoresModel[] | []>([]);

  public abrirCadastro = output();

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
  }

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
