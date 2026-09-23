import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { PerfilModel } from '../../../../entities/perfil.model';

@Component({
  selector: 'app-inicial-perfil',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: '/inicial-perfil.html',
  styles: ``,
})
export class InicialPerfil {
  public listar = input<PerfilModel[] | []>([]);

  public abrirCadastro = output();

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
  }

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
