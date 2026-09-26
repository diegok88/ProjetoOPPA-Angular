import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmpresaModel } from '../../../../entities/empresa.model';

@Component({
  selector: 'app-list-empresa',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './list-empresa.html',
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
export class ListEmpresa implements OnInit {
  protected displayedColumns: string[] = ['codigo', 'razaoSocial', 'acao'];

  public listar = input<EmpresaModel[] | []>([]);
  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.listar();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
