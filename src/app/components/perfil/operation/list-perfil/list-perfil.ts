import { Component, inject, OnInit, output } from '@angular/core';
import { PerfilService } from '../../../../services/perfil.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-perfil',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="listar()">
      <ng-container matColumnDef="codigo">
        <th mat-header-cell *matHeaderCellDef>Codigo</th>
        <td mat-cell *matCellDef="let element">{{ element.codigo }}</td>
      </ng-container>
      <ng-container matColumnDef="descricao">
        <th mat-header-cell *matHeaderCellDef>Descrição</th>
        <td mat-cell *matCellDef="let element">{{ element.descricao }}</td>
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
  private perfilService = inject(PerfilService);

  protected readonly listar = this.perfilService.perfil;

  protected displayedColumns: string[] = ['codigo', 'descricao', 'acao'];

  public abrirRegistro = output<string>();

  ngOnInit(): void {
    this.carregar().subscribe();
  }

  protected carregar() {
    return this.perfilService.listar();
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
