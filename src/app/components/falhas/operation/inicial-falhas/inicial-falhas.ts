import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Contador } from '../../../../interfaces/counter.interface';
@Component({
  selector: 'app-inicial-falhas',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-falhas.html',
  styles: ``,
})
export class InicialFalhas {
  public contador = input<Contador | null>(null);
  public abrirCadastro = output();
  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}