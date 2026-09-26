import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { EmpresaModel } from '../../../../entities/empresa.model';
import { Contador } from '../../../../interfaces/counter.interface';

@Component({
  selector: 'app-inicial-empresa',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inicial-empresa.html',
  styles: ``,
})
export class InicialEmpresa {
  public contador = input<Contador | null>(null);

  public abrirCadastro = output();

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
