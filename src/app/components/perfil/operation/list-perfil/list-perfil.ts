import { Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PerfilModel } from '../../../../entities/perfil.model';
import { timer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list-perfil',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: '/list-perfil.html',
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

  public listar = input<PerfilModel[] | []>([]);
  public abrirRegistro = output<string>();

  private readonly dadosRecebidos = signal<boolean>(false);
  private readonly tempoMinimo = signal<boolean>(false);

  protected carregando = computed(() => !(this.dadosRecebidos() && this.tempoMinimo()));

  private readonly efeitoCarregamento = effect(() => {
    if (this.listar() !== undefined) {
      this.dadosRecebidos.set(true);
    }
  });

  ngOnInit(): void {
    timer(1500).subscribe(() => this.tempoMinimo.set(true));
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
