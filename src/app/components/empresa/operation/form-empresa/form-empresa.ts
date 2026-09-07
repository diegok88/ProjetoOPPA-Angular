import { Component, computed, inject, input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { EmpresaService } from '../../../../services/empresa.service';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';
import {
  EmpresaModel,
  EmpresaType,
  ErrorEmpresaType,
  INICIALIZAR_EMPRESA_ENTITY,
  INICIALIZAR_EMPRESA_FORMS,
  TOUCHED_EMPRESA_MAP,
} from '../../../../entities/empresa.model';
import {
  CONFIRMAR_ATUALIZAR,
  CONFIRMAR_CADASTRAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';

@Component({
  selector: 'app-form-empresa',
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
                <p class="list-data">{{ buscar().id }}</p>
              </span>
            </mat-list-item>
          </mat-list>
        }
        <mat-form-field appearance="outline">
          <mat-label>Cnpj</mat-label>
          <input
            matInput
            type="text"
            id="cnpj"
            name="cnpj"
            placeholder="Insira o cnpj da empresa"
            [ngModel]="getField('cnpj')"
            (ngModelChange)="setField('cnpj', $event)"
            (blur)="onBlur('cnpj')"
            autocomplete="off"
          />
          @if (getField('descricao')) {
            <!-- PARA O BOTÃO NÃO SER SUBMETIDO IGUAL A DO CADASTRAR O MESMO DEVE SER TIPADO - type="button" -->
            <button
              matSuffix
              matIconButton
              type="button"
              aria-label="Clear"
              (click)="clearField('cnpj')"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
          <mat-hint>
            <span class="error-message" [class.show]="!!cnpjError()">
              {{ getErrorMessage(cnpjError()) }}
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
export class FormEmpresa {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private empresaService = inject(EmpresaService);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public listar = input<EmpresaModel[] | []>([]);
  public buscar = input<EmpresaModel>({ ...INICIALIZAR_EMPRESA_ENTITY });
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected empresaModel = signal<EmpresaModel>({ ...INICIALIZAR_EMPRESA_FORMS });

  /* RESPONSIVIDADE ENTRE O FORMS DE CADASTRAR E ATUALIZAR */
  protected formsResponsive = computed(() => {
    return this.operacaoAtual() === OperationMap.REGISTRO;
  });

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(true);

  /*-----------------------------------------------------------------------------------------*/
  protected cnpjTouched = signal<boolean>(false);

  protected cnpjError = computed<ErrorEmpresaType>(() => {
    const touched = this.cnpjTouched();
    const submitted = this.formSubmitted();

    if (!touched && !submitted) return null;

    const value = this.empresaModel().cnpj.toUpperCase();

    if (!value || value.trim().length === 0) return 'emptyCnpj';

    if (value === this.buscar().cnpj) return 'equalCnpj';

    return null;
  });

  //----------------------------------------------------------------------------------------//
  /*
  protected isCnpjEquals = computed(() => {
    const atual = this.buscar()?.cnpj;
    const novo = this.empresaModel().cnpj.toUpperCase();
    return atual === novo;
  });

  protected cnpjEqualsFiedlsError = computed(() => {
    return (this.cnpjTouched() || this.formSubmitted()) && this.isCnpjEquals();
  });

  protected isCnpjEmpty = computed(() => {
    return this.empresaModel().cnpj.trim().length === 0;
  });

  protected cnpjEmptyFiedlsError = computed(() => {
    return (this.cnpjTouched() || this.formSubmitted()) && this.isCnpjEmpty();
  });
  */
  //----------------------------------------------------------------------------------------//
  protected razaoSocialTouched = signal<boolean>(false);

  protected isRazaoSocialEquals = computed(() => {
    const atual = this.buscar()?.razaoSocial;
    const novo = this.empresaModel().razaoSocial.toUpperCase();
    return atual === novo;
  });

  protected razaoSocialEqualsFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEquals();
  });

  protected isRazaoSocialEmpty = computed(() => {
    return this.empresaModel().razaoSocial.trim().length === 0;
  });

  protected razaoSocialEmptyFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected nomeFantasiaTouched = signal<boolean>(false);

  protected isNomeFantasiaEquals = computed(() => {
    const atual = this.buscar()?.nomeFantasia;
    const novo = this.empresaModel().nomeFantasia.toUpperCase();
    return atual === novo;
  });

  protected nomeFantasiaEqualsFiedlsError = computed(() => {
    return (this.nomeFantasiaTouched() || this.formSubmitted()) && this.isNomeFantasiaEquals();
  });

  protected isNomeFantasiaEmpty = computed(() => {
    return this.empresaModel().nomeFantasia.trim().length === 0;
  });

  protected nomeFantasiaEmptyFiedlsError = computed(() => {
    return (this.nomeFantasiaTouched() || this.formSubmitted()) && this.isNomeFantasiaEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected contatoTouched = signal<boolean>(false);

  protected isContatoEquals = computed(() => {
    const atual = this.buscar()?.contato;
    const novo = this.empresaModel().contato.toUpperCase();
    return atual === novo;
  });

  protected contatoEqualsFiedlsError = computed(() => {
    return (this.contatoTouched() || this.formSubmitted()) && this.isContatoEquals();
  });

  protected isContatoEmpty = computed(() => {
    return this.empresaModel().contato.trim().length === 0;
  });

  protected contatoEmptyFiedlsError = computed(() => {
    return (this.contatoTouched() || this.formSubmitted()) && this.isContatoEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected emailTouched = signal<boolean>(false);

  protected isEmailEquals = computed(() => {
    const atual = this.buscar()?.email;
    const novo = this.empresaModel().email.toUpperCase();
    return atual === novo;
  });

  protected emailEqualsFiedlsError = computed(() => {
    return (this.emailTouched() || this.formSubmitted()) && this.isEmailEquals();
  });

  protected isEmailEmpty = computed(() => {
    return this.empresaModel().email.trim().length === 0;
  });

  protected emailEmptyFiedlsError = computed(() => {
    return (this.emailTouched() || this.formSubmitted()) && this.isEmailEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected ruaTouched = signal<boolean>(false);

  protected isRuaEquals = computed(() => {
    const atual = this.buscar()?.rua;
    const novo = this.empresaModel().rua.toUpperCase();
    return atual === novo;
  });

  protected ruaEqualsFiedlsError = computed(() => {
    return (this.ruaTouched() || this.formSubmitted()) && this.isRuaEquals();
  });

  protected isRuaEmpty = computed(() => {
    return this.empresaModel().rua.trim().length === 0;
  });

  protected ruaEmptyFiedlsError = computed(() => {
    return (this.ruaTouched() || this.formSubmitted()) && this.isRuaEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected numeroTouched = signal<boolean>(false);

  protected isNumeroEquals = computed(() => {
    const atual = this.buscar()?.numero;
    const novo = this.empresaModel().numero.toUpperCase();
    return atual === novo;
  });

  protected numeroEqualsFiedlsError = computed(() => {
    return (this.numeroTouched() || this.formSubmitted()) && this.isNumeroEquals();
  });

  protected isNumeroEmpty = computed(() => {
    return this.empresaModel().numero.trim().length === 0;
  });

  protected numeroEmptyFiedlsError = computed(() => {
    return (this.numeroTouched() || this.formSubmitted()) && this.isNumeroEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected bairroTouched = signal<boolean>(false);

  protected isBairroEquals = computed(() => {
    const atual = this.buscar()?.bairro;
    const novo = this.empresaModel().bairro.toUpperCase();
    return atual === novo;
  });

  protected bairroEqualsFiedlsError = computed(() => {
    return (this.bairroTouched() || this.formSubmitted()) && this.isBairroEquals();
  });

  protected isBairroEmpty = computed(() => {
    return this.empresaModel().bairro.trim().length === 0;
  });

  protected bairroEmptyFiedlsError = computed(() => {
    return (this.bairroTouched() || this.formSubmitted()) && this.isBairroEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected cidadeTouched = signal<boolean>(false);

  protected isCidadeEquals = computed(() => {
    const atual = this.buscar()?.cidade;
    const novo = this.empresaModel().cidade.toUpperCase();
    return atual === novo;
  });

  protected cidadeEqualsFiedlsError = computed(() => {
    return (this.cidadeTouched() || this.formSubmitted()) && this.isCidadeEquals();
  });

  protected isCidadeEmpty = computed(() => {
    return this.empresaModel().cidade.trim().length === 0;
  });

  protected cidadeEmptyFiedlsError = computed(() => {
    return (this.cidadeTouched() || this.formSubmitted()) && this.isCidadeEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected estadoTouched = signal<boolean>(false);

  protected isEstadoEquals = computed(() => {
    const atual = this.buscar()?.estado;
    const novo = this.empresaModel().estado.toUpperCase();
    return atual === novo;
  });

  protected estadoEqualsFiedlsError = computed(() => {
    return (this.estadoTouched() || this.formSubmitted()) && this.isEstadoEquals();
  });

  protected isEstadoEmpty = computed(() => {
    return this.empresaModel().estado.trim().length === 0;
  });

  protected estadoEmptyFiedlsError = computed(() => {
    return (this.estadoTouched() || this.formSubmitted()) && this.isEstadoEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected cepTouched = signal<boolean>(false);

  protected isCepEquals = computed(() => {
    const atual = this.buscar()?.estado;
    const novo = this.empresaModel().estado.toUpperCase();
    return atual === novo;
  });

  protected cepEqualsFiedlsError = computed(() => {
    return (this.cepTouched() || this.formSubmitted()) && this.isCepEquals();
  });

  protected isCepEmpty = computed(() => {
    return this.empresaModel().cep.trim().length === 0;
  });

  protected cepEmptyFiedlsError = computed(() => {
    return (this.cepTouched() || this.formSubmitted()) && this.isCepEmpty();
  });
  //----------------------------------------------------------------------------------------//

  /* FUNÇÃO DE VALIDAÇÃO AO APLICAR A SUBMIT */
  protected isFormValid = computed(() => {
    //const cnpjOk = this.cnpjEmptyFiedlsError() || this.cnpjEqualsFiedlsError();
    const cnpjOk = this.cnpjError() === null;
    const razaoSocialOk = this.razaoSocialEmptyFiedlsError() || this.razaoSocialEqualsFiedlsError();
    const nomeFantasiaOk =
      this.nomeFantasiaEmptyFiedlsError() || this.nomeFantasiaEqualsFiedlsError();
    const contatoOk = this.contatoEmptyFiedlsError() || this.contatoEqualsFiedlsError();
    const emailOk = this.emailEmptyFiedlsError() || this.emailEqualsFiedlsError();
    const ruaOk = this.ruaEmptyFiedlsError() || this.ruaEqualsFiedlsError();
    const numeroOk = this.numeroEmptyFiedlsError() || this.numeroEqualsFiedlsError();
    const bairroOk = this.bairroEmptyFiedlsError() || this.bairroEqualsFiedlsError();
    const cidadeOk = this.cidadeEmptyFiedlsError() || this.cidadeEqualsFiedlsError();
    const estadoOk = this.estadoEmptyFiedlsError() || this.estadoEqualsFiedlsError();
    const cepOk = this.cepEmptyFiedlsError() || this.cepEqualsFiedlsError();
    const touchedOk = this.touchedSubmitted();

    const dadosOk =
      cnpjOk ||
      razaoSocialOk ||
      nomeFantasiaOk ||
      contatoOk ||
      emailOk ||
      ruaOk ||
      numeroOk ||
      bairroOk ||
      cidadeOk ||
      estadoOk ||
      cepOk ||
      touchedOk;
    return dadosOk;
  });

  /* FUNÇÃO DE RECONHECIMENTO DE CAMPO TOCADO */
  protected onBlur(field: EmpresaType): void {
    if (!field) return;
    this.touchedSubmitted.set(false);
    const nomePropriedade = TOUCHED_EMPRESA_MAP[field];
    const signalRef = this[nomePropriedade as keyof this] as WritableSignal<boolean>;
    if (signalRef) {
      signalRef.set(true);
    }
  }

  /* GETTER E SETTER DA ENTIDADE */
  protected getField(field: keyof EmpresaModel) {
    return this.empresaModel()[field] ?? '';
  }

  protected setField(field: keyof EmpresaModel, value: string): void {
    this.empresaModel.update((model) => ({ ...model, [field]: value }));
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR
    ) {
      this.empresaModel.set(this.buscar());
      this.isAtualizar.set(true);
    } else {
      this.isAtualizar.set(false);
    }
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.empresaService.listar();
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }

    const empresa = this.empresaModel();
    const id = this.buscar()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'empresa',
          dados: empresa.razaoSocial.toUpperCase(),
          acao: () => this.empresaService.cadastrar(empresa),
        })
        .subscribe((confirmado) => {
          console.log(confirmado);
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'empresa',
          dados: empresa.razaoSocial.toUpperCase(),
          acao: () => this.empresaService.atualizar(id!, empresa),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização do empresa',
              dados: empresa.razaoSocial.toUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof EmpresaModel) {
    this.empresaModel.update((current) => {
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
    this.empresaModel.set({ ...INICIALIZAR_EMPRESA_FORMS });
    this.cnpjTouched.set(false);
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
