import { Component, input, output } from '@angular/core';
import { Contador } from '../../../../interfaces/counter.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inicial-empresa-ad-ge',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-empresa-ad-ge.html',
  styles: ``,
})
export class InicialEmpresaAdGe {
  public contador = input<Contador | null>(null);

  public abrirCadastro = output();

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
