import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { SetoresModel } from '../../../../entities/setores.model';
import { Contador } from '../../../../interfaces/counter.interface';

@Component({
  selector: 'app-inicial-setores',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-setores.html',
  styles: ``,
})
export class InicialSetores {
  public contador = input<Contador | null>(null);

  public abrirCadastro = output();

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
