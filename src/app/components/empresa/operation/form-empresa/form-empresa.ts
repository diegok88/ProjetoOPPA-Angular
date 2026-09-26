import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
  CamposEmpresa,
  CamposEmpresaLetras,
  CamposEmpresaNumeros,
  EmpresaForm,
  EmpresaModel,
  EmpresaType,
  ErrorEmpresaType,
  getErrorMessage,
  INICIALIZAR_EMPRESA_ENTITY,
  INICIALIZAR_EMPRESA_FORMS,
} from '../../../../entities/empresa.model';
import {
  CONFIRMAR_ATUALIZAR,
  CONFIRMAR_CADASTRAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_ALT,
  FINALIZAR_ERRO_FORM,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form-empresa',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    NgxMaskDirective,
  ],
  templateUrl: './form-empresa.html',
  styles: ``,
})
export class FormEmpresa implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private empresaService = inject(EmpresaService);

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR,  NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscar = input<EmpresaModel>(INICIALIZAR_EMPRESA_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected empresaModel = signal<EmpresaForm>(INICIALIZAR_EMPRESA_FORMS());

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

    if (CamposEmpresaLetras.includes(campo as keyof EmpresaForm)) {
      if (isNumbers) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: false }));
      }
    } else if (CamposEmpresaNumeros.includes(campo as keyof EmpresaForm)) {
      if (isLetters) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: false }));
      }
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorEmpresaType>>(() => {
    return CamposEmpresa.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        let erro: ErrorEmpresaType = null;

        if (touched || submitted) {
          const value = (this.empresaModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();

          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorEmpresaType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorEmpresaType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorEmpresaType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorEmpresaType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected cnpjError = computed(() => this.erros()['cnpj']);
  protected razaoSocialError = computed(() => this.erros()['razaoSocial']);
  protected nomeFantasiaError = computed(() => this.erros()['nomeFantasia']);
  protected contatoError = computed(() => this.erros()['contato']);
  protected emailError = computed(() => this.erros()['email']);
  protected ruaError = computed(() => this.erros()['rua']);
  protected numeroError = computed(() => this.erros()['numero']);
  protected bairroError = computed(() => this.erros()['bairro']);
  protected cidadeError = computed(() => this.erros()['cidade']);
  protected estadoError = computed(() => this.erros()['estado']);
  protected cepError = computed(() => this.erros()['cep']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: EmpresaType): string {
    return getErrorMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposEmpresa.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: EmpresaType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER DA ENTIDADE */
  protected getField(field: keyof EmpresaForm) {
    return this.empresaModel()[field] ?? '';
  }
  /* SETTER DA ENTIDADE */
  protected setField(field: keyof EmpresaModel, value: string): void {
    this.empresaModel.update((model) => ({ ...model, [field]: value }));

    this.invalidCharFields.update((state) => {
      const novo = { ...state };
      delete novo[field as string];
      return novo;
    });
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    const dados = this.formatarModel();

    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.empresaModel.set(dados);
      this.isAtualizar.set(true);

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS
  private formatarModel(): EmpresaForm {
    const fieldsFormat = CamposEmpresa.reduce((acc, c) => {
      if (this.buscar()[c] !== undefined && this.buscar()[c] !== null) {
        acc[c] = this.buscar()[c];
      }
      return acc;
    }, {} as Partial<EmpresaForm>);
    return fieldsFormat as EmpresaForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.empresaService.listar();
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONATDOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.empresaService.counter();
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
        operacao: 'Cadastro do empresa',
        dados: this.empresaModel().razaoSocial.toLocaleUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização do empresa',
        dados: this.empresaModel().razaoSocial.toLocaleUpperCase(),
      });
      return;
    }

    const empresa = this.empresaModel();
    console.log(empresa);
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
            this.carregarContador().subscribe();
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
  protected clearField(field: keyof EmpresaForm) {
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
    this.empresaModel.set(INICIALIZAR_EMPRESA_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
