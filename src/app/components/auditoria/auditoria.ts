import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { FormatarDadosRegistradosPipe } from '../../pipes/formatar-dados-registrados-pipe';

@Component({
  selector: 'app-auditoria',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatButtonModule,
    FormatarDadosRegistradosPipe,
  ],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.scss',
})
export class Auditoria {
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
