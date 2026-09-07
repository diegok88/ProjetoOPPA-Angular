import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { PerfilService } from '../../../../services/perfil.service';
import { MatListModule } from '@angular/material/list';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';
import {
  INICIALIZAR_PERFIL_ENTITY,
  INICIALIZAR_PERFIL_FORMS,
  PerfilMap,
  PerfilModel,
  PerfilType,
} from '../../../../entities/perfil.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import {
  CONFIRMAR_ATUALIZAR,
  CONFIRMAR_CADASTRAR,
} from '../../../../entities/dialogo-confirmar.model';

@Component({
  selector: 'app-form-perfil',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  template: `
    <form class="forms-operacao" (ngSubmit)="executar($event)" [class.resp]="formsResponsive()">
      <section class="forms-group">
        @if (isAtualizar()) {
          <mat-list>
            <mat-list-item>
              <span matListItemTitle>
                <p class="list-label">Id:</p>
                <p class="list-data">{{ buscarPerfil().id }}</p>
              </span>
            </mat-list-item>
          </mat-list>
        }
        <mat-form-field appearance="outline">
          <mat-label>Descrição</mat-label>
          <input
            matInput
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Insira a descrição do perfil"
            [ngModel]="getField('descricao')"
            (ngModelChange)="setField('descricao', $event)"
            (blur)="onBlur('descricao')"
            autocomplete="off"
          />
          @if (getField('descricao')) {
            <!-- PARA O BOTÃO NÃO SER SUBMETIDO IGUAL A DO CADASTRAR O MESMO DEVE SER TIPADO - type="button" -->
            <button
              matSuffix
              matIconButton
              type="button"
              aria-label="Clear"
              (click)="clearField('descricao')"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
          <mat-hint>
            <span class="error-message" [class.show]="descricaoEmptyFiedlsError()">
              O descrição é obrigatório
            </span>
            <span class="error-message" [class.show]="descricaoEqualsFiedlsError()">
              A descrição igual a cadastrada.
            </span>
          </mat-hint>
        </mat-form-field>
      </section>
      @if (isAtualizar()) {
        <button matButton="outlined" type="submit" [disabled]="isFormValid()">Atualizar</button>
      } @else {
        <button matButton="outlined" type="submit" [disabled]="isFormValid()">Cadastrar</button>
      }
    </form>
  `,
  styles: ``,
})
export class FormPerfil implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private perfilService = inject(PerfilService);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public listarPerfil = input<PerfilModel[] | []>([]);
  public buscarPerfil = input<PerfilModel>({ ...INICIALIZAR_PERFIL_ENTITY });
  public onMudarOperacao = output<OperationType>();
  /* MODELO DE ENTRADA DE DADOS */
  protected perfilModel = signal<PerfilModel>({ ...INICIALIZAR_PERFIL_FORMS });

  protected formsResponsive = computed(() => {
    return this.operacaoAtual() === OperationMap.REGISTRO;
  });

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(true);

  protected descricaoTouched = signal<boolean>(false);

  protected isDescricaoEquals = computed(() => {
    const des = this.perfilModel().descricao.toUpperCase();
    if (this.registroAtual() === RecordMap.ATUALIZAR) {
      const atualizaIgual = des === this.buscarPerfil()?.descricao;
      const registroIgual = this.listarPerfil().some((item) => item.descricao === des);
      return atualizaIgual || registroIgual;
    }
    const registroIgual = this.listarPerfil().some((item) => item.descricao === des);
    return registroIgual;
  });

  protected descricaoEqualsFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEquals();
  });

  protected isDescricaoEmpty = computed(() => {
    return this.perfilModel().descricao.trim().length === 0;
  });

  protected descricaoEmptyFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEmpty();
  });

  /* FUNÇÃO DE VALIDAÇÃO AO APLICAR A SUBMIT */
  protected isFormValid = computed(() => {
    const descricaoOk = this.descricaoEmptyFiedlsError() || this.descricaoEqualsFiedlsError();
    const touchedOk = this.touchedSubmitted();
    const dadosOk = descricaoOk || touchedOk;
    return dadosOk;
  });

  /* FUNÇÃO DE RECONHECIMENTO DE CAMPO TOCADO */
  protected onBlur(field: PerfilType): void {
    if (field) this.touchedSubmitted.set(false);
    if (field === PerfilMap.DESCRICAO) this.descricaoTouched.set(true);
  }

  /* GETTER E SETTER DA ENTIDADE */
  protected getField(field: keyof PerfilModel) {
    return this.perfilModel()[field] ?? '';
  }

  protected setField(field: keyof PerfilModel, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR
    ) {
      this.perfilModel.set({ descricao: this.buscarPerfil()!.descricao });
      this.isAtualizar.set(true);
    } else {
      this.isAtualizar.set(false);
    }
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.perfilService.listar();
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }

    const perfil = this.perfilModel();
    const id = this.buscarPerfil()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'perfil',
          dados: perfil.descricao.toUpperCase(),
          acao: () => this.perfilService.cadastrar(perfil),
        })
        .subscribe((confirmado) => {
          console.log(confirmado);
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'perfil',
          dados: perfil.descricao.toUpperCase(),
          acao: () => this.perfilService.atualizar(id!, perfil),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização do perfil',
              dados: perfil.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof PerfilModel) {
    this.perfilModel.update((current) => {
      const emptyValue = this.getEmptyValue(current[field]);
      return { ...current, [field]: emptyValue };
    });
  }

  /* FUNÇÃO PARA IDENTIFICAR O TIPO DE DADOS O CAMPO PERTENCE */
  private getEmptyValue(value: any): any {
    if (typeof value === 'string') return '';
    if (typeof value === 'number') return 0;
    if (typeof value === 'boolean') return false;
    if (value instanceof Date) return null; // ou new Date()
    return null;
  }

  /* FUNÇÃO PARA RESETAR TODO O COMPONENTE */
  private resetForm(): void {
    this.perfilModel.set({ ...INICIALIZAR_PERFIL_FORMS });
    this.descricaoTouched.set(false);
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
