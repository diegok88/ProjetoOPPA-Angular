import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PerfilData } from '../../../../interfaces/perfil-data.interface';

@Component({
  selector: 'app-list-perfil',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="listaPerfil()">
      <ng-container matColumnDef="codigo">
        <th mat-header-cell *matHeaderCellDef>Codigo</th>
        <td mat-cell *matCellDef="let element">{{ element?.codigo }}</td>
      </ng-container>
      <ng-container matColumnDef="descricao">
        <th mat-header-cell *matHeaderCellDef>Descrição</th>
        <td mat-cell *matCellDef="let element">{{ element?.descricao }}</td>
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
export class ListPerfil implements OnInit {
  protected displayedColumns: string[] = ['codigo', 'descricao', 'acao'];

  public listaPerfil = input<PerfilData[] | []>([]);
  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.listaPerfil();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
