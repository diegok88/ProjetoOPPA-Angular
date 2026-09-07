import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmpresaModel } from '../../../../entities/empresa.model';

@Component({
  selector: 'app-list-empresa',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  template: `
    @if (listaPerfil().length) {
      <table mat-table [dataSource]="listaEmpresa()" class="tabela-lista">
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef>Codigo</th>
          <td mat-cell *matCellDef="let element">{{ element?.codigo }}</td>
        </ng-container>
        <ng-container matColumnDef="razaoSocial">
          <th mat-header-cell *matHeaderCellDef>Razão Social</th>
          <td mat-cell *matCellDef="let element">{{ element?.razaoSocial }}</td>
        </ng-container>
        <ng-container matColumnDef="acao">
          <th mat-header-cell *matHeaderCellDef>Ação</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="accent" (click)="onAbrirRegistro(element.id)">
              <mat-icon fontSet="material-symbols-outlined">more_horiz</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } @else {
      <img class="image-list" src="images/mystery.png" alt="Vazia" />
    }
  `,
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
export class ListEmpresa {
  protected displayedColumns: string[] = ['codigo', 'razaoSocial', 'acao'];

  public listarEmpresa = input<EmpresaModel[] | []>([]);
  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.listarEmpresa();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
