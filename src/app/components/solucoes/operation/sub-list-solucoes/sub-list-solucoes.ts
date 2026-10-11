import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { SolucoesModel } from '../../../../entities/solucoes.model';
import { Subscription, timer } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sub-list-solucoes',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './sub-list-solucoes.html',
  styles: `
    th.mat-mdc-header-cell:nth-child(1),
    td.mdc-data-table__cell:nth-child(1) {
      width: 15%;
    }
    th.mat-mdc-header-cell:nth-child(4),
    td.mdc-data-table__cell:nth-child(4) {
      width: 15%;
    }
  `,
})
export class SubListSolucoes implements OnInit, OnDestroy {
  protected displayedColumns: string[] = ['codigo', 'descricao', 'falhaId', 'acao'];

  public listar = input<SolucoesModel[] | []>([]);
  public abrirRegistro = output<string>();

  private readonly dadosRecebidos = signal<boolean>(false);
  private readonly tempoMinimo = signal<boolean>(false);

  private ultimoValor?: SolucoesModel[];
  private inscricaoTimer?: Subscription;

  protected carregando = computed(() => !(this.dadosRecebidos() && this.tempoMinimo()));

  private readonly efeitoCarregamento = effect(() => {
    const atual = this.listar();

    if (atual === this.ultimoValor) return; // mesma referência, nada mudou
    this.ultimoValor = atual;

    this.iniciarCiclo();
  });

  ngOnInit(): void {
    this.iniciarCiclo();
  }

  ngOnDestroy(): void {
    this.inscricaoTimer?.unsubscribe();
  }

  private iniciarCiclo(): void {
    this.dadosRecebidos.set(false);
    this.tempoMinimo.set(false);
    this.dadosRecebidos.set(true);

    this.inscricaoTimer?.unsubscribe();
    this.inscricaoTimer = timer(1500).subscribe(() => this.tempoMinimo.set(true));
  }

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
