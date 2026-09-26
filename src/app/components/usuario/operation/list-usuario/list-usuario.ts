import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UsuarioModel } from '../../../../entities/usuario.model';

@Component({
  selector: 'app-list-usuario',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './list-usuario.html',
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
export class ListUsuario implements OnInit {
  protected displayedColumns: string[] = ['cracha', 'nome', 'acao'];

  public listar = input<UsuarioModel[] | []>([]);
  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.listar();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
