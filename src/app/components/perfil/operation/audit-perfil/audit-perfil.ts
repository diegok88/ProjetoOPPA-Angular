import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuditoriaData } from '../../../../interfaces/auditoria-data.interface';
import { MatListModule } from '@angular/material/list';
import { FormatarDadosRegistradosPipe } from '../../../../pipes/formatar-dados-registrados-pipe';

@Component({
  selector: 'app-audit-perfil',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatButtonModule,
    FormatarDadosRegistradosPipe,
  ],
  template: `
    @if (auditoriaEstado()) {
      <table mat-table [dataSource]="listarAuditoria()" class="tabela-auditoria">
        <ng-container matColumnDef="acao">
          <th mat-header-cell *matHeaderCellDef>Ação</th>
          <td mat-cell *matCellDef="let element">{{ element?.acao }}</td>
        </ng-container>
        <ng-container matColumnDef="dataHora">
          <th mat-header-cell *matHeaderCellDef>Data/Hora</th>
          <td mat-cell *matCellDef="let element">{{ element?.dataHora }}</td>
        </ng-container>
        <ng-container matColumnDef="registradoPorId">
          <th mat-header-cell *matHeaderCellDef>Registrado Por Id</th>
          <td mat-cell *matCellDef="let element">{{ element?.registradoPorId }}</td>
        </ng-container>
        <ng-container matColumnDef="dadosRegistrados">
          <th mat-header-cell *matHeaderCellDef>Dados Registrados</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="accent" (click)="onAbrirRegistro(element)">
              <mat-icon fontSet="material-symbols-outlined">more_horiz</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    } @else {
      <section class="container-dados">
        <mat-list class="info-operacao">
          <mat-list-item>
            <span matListItemTitle>
              <p class="list-label">Id:</p>
              <p class="list-data">{{ buscarAuditoria()?.id }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p class="list-label">Ação:</p>
              <p class="list-data">{{ buscarAuditoria()?.acao }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Data/Hora:</p>
              <p>{{ buscarAuditoria()?.dataHora }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Registrado Por Id:</p>
              <p>{{ buscarAuditoria()?.registradoPorId }}</p></span
            >
          </mat-list-item>
          <mat-list-item class="dados-registrados">
            <span matListItemTitle>
              <p>Dados Registrados:</p>
              <p>{{ buscarAuditoria()?.dadosRegistrados | formatarDadosRegistrados }}</p>
            </span>
          </mat-list-item>
        </mat-list>
        <button matButton="outlined" (click)="onAbrirRegistro()">Voltar</button>
      </section>
    }
  `,
  styles: `
    th.mat-mdc-header-cell:nth-child(1),
    td.mdc-data-table__cell:nth-child(1) {
      width: 15%;
    }

    th.mat-mdc-header-cell:nth-child(2),
    td.mdc-data-table__cell:nth-child(2) {
      width: 15%;
    }

    th.mat-mdc-header-cell:nth-child(4),
    td.mdc-data-table__cell:nth-child(4) {
      width: 20%;
    }

    .container-dados {
      width: 100%;
      height: 95%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
    }

    .dados-registrados {
      height: 150px !important;
      width: 910px !important;

      p {
        white-space: pre-wrap;
        height: auto;
        width: auto;
      }
    }

    @media (max-height: 750px) {
      .container-dados {
        height: 94%;
      }
    }
  `,
})
export class AuditPerfil {
  public listarAuditoria = input<AuditoriaData[] | []>([]);
  protected buscarAuditoria = signal<AuditoriaData | null>(null);
  protected auditoriaEstado = signal<boolean>(true);

  protected displayedColumns: string[] = [
    'acao',
    'dataHora',
    'registradoPorId',
    'dadosRegistrados',
  ];

  protected onAbrirRegistro(dados?: AuditoriaData): void {
    if (this.auditoriaEstado() && dados) {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(dados);
    } else {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(null);
    }
  }
}
