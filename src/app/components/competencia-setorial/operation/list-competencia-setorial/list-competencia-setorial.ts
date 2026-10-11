import { Component, computed, input, output, signal } from '@angular/core';
import { GestorModel } from '../../../../entities/gestor.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-list-competencia-setorial',
  imports: [MatTabsModule, MatIconModule, MatButtonModule],
  templateUrl: './list-competencia-setorial.html',
  styles: `
    /* ============ CONTAINER GERAL ============ */
    :host {
      display: block;
      height: 100%;
    }

    :host ::ng-deep .mat-mdc-tab-group {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    /* Área do conteúdo da aba: altura fixa + scroll interno */
    :host ::ng-deep .mat-mdc-tab-body-wrapper {
      flex: 1;
      min-height: 0; /* permite encolher abaixo do conteúdo */
    }

    :host ::ng-deep .mat-mdc-tab-body-active {
      height: 100%;
      overflow-y: auto; /* rola quando a lista ultrapassar */
    }

    /* ============ ABAS ============ */
    :host ::ng-deep .mat-mdc-tab {
      color: var(--color-white);

      padding: 0 5px;

      .mdc-tab__text-label {
        color: var(--color-white);
        opacity: 0.7; /* aba inativa fica discreta */
      }
    }

    :host ::ng-deep .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
      opacity: 1; /* aba ativa em destaque */
    }

    :host ::ng-deep .mat-ink-bar {
      background-color: var(--color-white);
    }

    /* Label com contador (badge) */
    .tab-label {
      display: inline-flex;
      align-items: center;
      font-size: 0.9em;
      gap: 8px;
    }

    .tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: 22px;
      height: 22px;
      padding: 0 5px;

      border-radius: 11px;
      background: color-mix(in srgb, var(--color-white) 15%, transparent);
      font-size: 0.75em;
      font-weight: 600;
    }

    /* ============ LISTA ============ */
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      height: 41px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 400;
      gap: 8px;

      padding: 0;

      /* separador discreto em vez de borda por item */
      border-bottom: 2px solid var(--color-white);
    }

    li:hover {
      background-color: rgba(255, 255, 255, 0.1);
      cursor: default;
    }

    li:last-child {
      border-bottom: none;
    }

    li > .identificacao {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
      min-width: 0; /* nome longo não empurra o botão */
    }

    /* Colunas fixas: crachá alinhado + nome com ellipsis */
    .cracha {
      min-width: 50px;
      font-variant-numeric: tabular-nums;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nome {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Estado vazio */
    .vazio {
      padding-top: 10px;
      justify-content: center;
      color: color-mix(in srgb, var(--color-white) 55%, transparent);
      font-style: italic;
      border-bottom: none;
    }

    /* Botão não encolhe */
    button {
      flex-shrink: 0;
    }
  `,
})
export class ListCompetenciaSetorial {
  protected readonly panelOpenState = signal<boolean>(false);

  public listar = input<GestorModel[] | []>([]);
  public abrirRegistro = output<string>();

  protected listarC = computed(() =>
    this.listar().filter((g) => g.colaborador.turno === 'COMERCIAL'),
  );
  protected listarM = computed(() => this.listar().filter((g) => g.colaborador.turno === 'MANHA'));
  protected listarT = computed(() => this.listar().filter((g) => g.colaborador.turno === 'TARDE'));
  protected listarN = computed(() => this.listar().filter((g) => g.colaborador.turno === 'NOITE'));

  protected onAbrirRegistro(id: string): void {
    this.abrirRegistro.emit(id);
  }
}
