import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UsuarioModel } from '../../../../entities/usuario.model';

@Component({
  selector: 'app-list-usuario',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  template: `
    @if (listar().length) {
      <table mat-table [dataSource]="listar()" class="tabela-lista">
        <ng-container matColumnDef="cracha">
          <th mat-header-cell *matHeaderCellDef>Crachá</th>
          <td mat-cell *matCellDef="let element">{{ element?.cracha }}</td>
        </ng-container>
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let element">{{ element?.nome }}</td>
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
      <div class="operation-list-empty">
        <img class="image-list" src="images/mystery.png" alt="Vazia" />
        <span class="text-list-empty">Lista Vazia!</span>
      </div>
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
