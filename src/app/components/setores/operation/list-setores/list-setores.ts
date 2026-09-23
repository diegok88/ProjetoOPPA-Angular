import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SetoresModel } from '../../../../entities/setores.model';

@Component({
  selector: 'app-list-setores',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './list-setores.html',
  styles: `
    th.mat-mdc-header-cell:nth-child(1),
    td.mdc-data-table__cell:nth-child(1) {
      width: 15%;
    }

    th.mat-mdc-header-cell:nth-child(3),
    td.mdc-data-table__cell:nth-child(3) {
      width: 15%;
    }
  `,
})
export class ListSetores {
  protected displayedColumns: string[] = ['codigo', 'descricao', 'acao'];

  public listar = input<SetoresModel[] | []>([]);
  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.listar();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
