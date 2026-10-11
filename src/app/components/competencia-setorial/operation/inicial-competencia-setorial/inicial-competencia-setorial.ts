import { Component, input, output } from '@angular/core';
import { Contador } from '../../../../interfaces/counter.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inicial-competencia-setorial',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-competencia-setorial.html',
  styles: ``,
})
export class InicialCompetenciaSetorial {
  public contador = input<Contador | null>(null);

  public abrirCadastro = output();

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
