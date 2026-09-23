import { Component, input, signal } from '@angular/core';
import { AuditoriaData } from '../../../../interfaces/auditoria-data.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { FormatarDadosRegistradosPipe } from '../../../../pipes/formatar-dados-registrados-pipe';

@Component({
  selector: 'app-audit-setores',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatButtonModule,
    FormatarDadosRegistradosPipe,
  ],
  templateUrl: './audit-setores.html',
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

    .container-operation-dados-registrados {
      height: auto !important;
      min-height: 0 !important;
      width: 810px !important;
      padding: 16px !important;

      p {
        white-space: pre-wrap;
        height: auto;
        width: auto;
      }
    }
  `,
})
export class AuditSetores {
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
