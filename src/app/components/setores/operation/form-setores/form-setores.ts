import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CamposSetores,
  CamposSetoresLetras,
  CamposSetoresNumeros,
  ErrorSetoresType,
  getErrorSetoresMessage,
  INICIALIZAR_SETORES_ENTITY,
  INICIALIZAR_SETORES_FORMS,
  SetoresForm,
  SetoresModel,
  SetorType,
} from '../../../../entities/setores.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';
import {
  OperationType,
  RecordType,
  OperationMap,
  RecordMap,
} from '../../../../constants/operation-map.const';
import {
  CONFIRMAR_CADASTRAR,
  CONFIRMAR_ATUALIZAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_ERRO_FORM,
  FINALIZAR_ERRO_ALT,
  FINALIZAR_SUCESSO,
  FINALIZAR_ERRO,
  FINALIZAR_CANCELAR,
} from '../../../../entities/dialogo-finalizar.model';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { SetoresService } from '../../../../services/setores.service';

@Component({
  selector: 'app-form-setores',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './form-setores.html',
  styles: ``,
})
export class FormSetores {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private setoresService = inject(SetoresService);

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR,  NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public listar = input<SetoresModel[] | []>([]);
  public buscar = input<SetoresModel>(INICIALIZAR_SETORES_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected setoresModel = signal<SetoresForm>(INICIALIZAR_SETORES_FORMS());

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);

  protected fieldTouched = signal<Record<string, boolean>>({});

  protected invalidCharFields = signal<Record<string, boolean>>({});

  /* FUNÇÃO QUE INTERCEPTA A TENTATIVA DE INSERIR CARACTERES INVALIDOS */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    const key = event.key;

    const isNumbers = /[0-9]/.test(key);
    const isLetters = /[a-zA-ZÀ-ÿ]/.test(key);

    if (CamposSetoresLetras.includes(campo as keyof SetoresForm) && isNumbers) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
    } else if (CamposSetoresNumeros.includes(campo as keyof SetoresForm) && isLetters) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorSetoresType>>(() => {
    return CamposSetores.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();
        const recordEqual = this.listar().some(
          (item) => item[campo] === this.setoresModel()[campo],
        );

        let erro: ErrorSetoresType = null;

        if (touched || submitted) {
          const value = (this.setoresModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();

          if (!value) erro = `empty${FormatarCampos(campo)}` as ErrorSetoresType;
          else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorSetoresType;
          } else if (recordEqual) {
            erro = `equalList${FormatarCampos(campo)}` as ErrorSetoresType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorSetoresType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorSetoresType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected descricaoError = computed(() => this.erros()['descricao']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: SetorType): string {
    return getErrorSetoresMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposSetores.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: SetorType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER E SETTER DA ENTIDADE */
  protected getField(field: keyof SetoresForm) {
    return this.setoresModel()[field] ?? '';
  }

  protected setField(field: keyof SetoresForm, value: string): void {
    this.setoresModel.update((model) => ({ ...model, [field]: value }));
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    const dados = this.formatarModel();

    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.setoresModel.set(dados);
      this.isAtualizar.set(true);

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS
  private formatarModel(): SetoresForm {
    const fieldsFormat = CamposSetores.reduce((acc, c) => {
      if (this.buscar()[c] !== undefined && this.buscar()[c] !== null) {
        acc[c] = this.buscar()[c];
      }
      return acc;
    }, {} as Partial<SetoresForm>);
    return fieldsFormat as SetoresForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.setoresService.listar();
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();
    if (this.isFormValid() && !this.isAtualizar()) {
      this.formSubmitted.set(true);
    }

    if (!this.isFormValid() && !this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro do setor',
        dados: this.setoresModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização do setor',
        dados: this.setoresModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    const setor = this.setoresModel();
    const id = this.buscar()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'setor',
          dados: setor.descricao.toUpperCase(),
          acao: () => this.setoresService.cadastrar(setor),
        })
        .subscribe((confirmado) => {
          console.log(confirmado);
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro do setor',
              dados: setor.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro do setor',
              dados: setor.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro do setor',
              dados: setor.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'setor',
          dados: setor.descricao.toUpperCase(),
          acao: () => this.setoresService.atualizar(id!, setor),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização do setor',
              dados: setor.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização do setor',
              dados: setor.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização do setor',
              dados: setor.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof SetoresForm) {
    this.setoresModel.update((current) => {
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
    this.setoresModel.set(INICIALIZAR_SETORES_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
