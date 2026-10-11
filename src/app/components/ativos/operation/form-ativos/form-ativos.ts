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
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';

import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';

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
import {
  AtivosModel,
  INICIALIZAR_ATIVOS_ENTITY,
  AtivosForm,
  INICIALIZAR_ATIVOS_FORMS,
  CamposAtivosLetras,
  CamposAtivosNumeros,
  ErrorAtivosType,
  CamposAtivos,
  AtivosType,
  getErrorAtivosMessage,
} from '../../../../entities/ativos.model';
import { AtivosService } from '../../../../services/ativos.service';
import { SetoresService } from '../../../../services/setores.service';
import { SetoresModel } from '../../../../entities/setores.model';
import { CompetenciaSetorialService } from '../../../../services/competencia-setorial.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-ativos',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  templateUrl: './form-ativos.html',
  styles: ``,
})
export class FormAtivos implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private authService = inject(AuthService);
  private ativosService = inject(AtivosService);
  private setoresService = inject(SetoresService);

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR, NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscar = input<AtivosModel>(INICIALIZAR_ATIVOS_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected ativosModel = signal<AtivosForm>(INICIALIZAR_ATIVOS_FORMS());

  /* SIGNAL READONLY DO SERVICE: o listar() preenche o signal interno
     via tap e o componente apenas lê - padrão do listarEmpresa */
  private readonly listarSetores = this.setoresService.listarSetores;

  /* OPÇÕES DO SELECT DERIVADAS POR COMPUTED:
     - Reage automaticamente quando a resposta do listar() chega ao service
     - Sem signal local e sem set() manual no subscribe
     - Se o campo de exibição do Setores não for 'descricao', ajuste aqui */
  protected setoresOptions = computed(() =>
    (this.listarSetores() ?? []).map((e: SetoresModel) => ({
      value: e.id,
      viewValue: `${e.codigo} - ${e.descricao}`,
    })),
  );

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

    if (CamposAtivosLetras.includes(campo as keyof AtivosForm)) {
      if (isNumbers) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({
          ...state,
          [campo]: false,
        }));
      }
    } else if (CamposAtivosNumeros.includes(campo as keyof AtivosForm)) {
      if (isLetters) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({
          ...state,
          [campo]: false,
        }));
      }
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorAtivosType>>(() => {
    return CamposAtivos.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        let erro: ErrorAtivosType = null;

        if (touched || submitted) {
          const value = (this.ativosModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();

          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorAtivosType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorAtivosType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorAtivosType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorAtivosType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected descricaoError = computed(() => this.erros()['descricao']);
  protected modeloError = computed(() => this.erros()['modelo']);
  protected fabricanteError = computed(() => this.erros()['fabricante']);
  protected anoError = computed(() => this.erros()['ano']);
  protected setorIdError = computed(() => this.erros()['setorId']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: AtivosType): string {
    return getErrorAtivosMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposAtivos.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: AtivosType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER DA ENTIDADE */
  protected getField(field: keyof AtivosForm) {
    return this.ativosModel()[field] ?? '';
  }

  /* SETTER DA ENTIDADE */
  protected setField(field: keyof AtivosForm, value: string): void {
    this.ativosModel.update((model) => ({ ...model, [field]: value }));
    this.invalidCharFields.update((state) => {
      const novo = { ...state };
      delete novo[field as string];
      return novo;
    });
  }

  /* INICIALIZADOR DO COMPONENTE:
     - Apenas dispara a requisição de setores: o computed setoresOptions
       atualiza o select sozinho quando a resposta chegar
     - Carrega o modelo no modo ATUALIZAR */
  ngOnInit(): void {
    this.carregarSetores().subscribe();

    const dados = this.formatarModel();
    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.ativosModel.set(dados);
      this.isAtualizar.set(true);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS (ano chega como number e vira string)
  private formatarModel(): AtivosForm {
    const fieldsFormat = CamposAtivos.reduce((acc, c) => {
      const valor = this.buscar()[c];
      if (valor !== undefined && valor !== null) {
        acc[c] = String(valor);
      }
      return acc;
    }, {} as Partial<AtivosForm>);

    return fieldsFormat as AtivosForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    const empresa = this.buscar().empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.ativosService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO OS DADOS DA ENTIDADE */
  protected carregarSetores() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.setoresService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.ativosService.counter();
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
        operacao: 'Cadastro do ativo',
        dados: this.ativosModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização do ativo',
        dados: this.ativosModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    /* CONVERSÃO DO FORM PARA O CONTRATO DO BACKEND:
       ano vira number; empresaId e status entram pelo controller */
    const form = this.ativosModel();
    const ativo: AtivosModel = {
      descricao: form.descricao.trim(),
      modelo: form.modelo.trim(),
      fabricante: form.fabricante.trim(),
      ano: Number(form.ano),
      setorId: form.setorId,
    };

    const id = this.buscar()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'ativo',
          dados: ativo.descricao.toUpperCase(),
          acao: () => this.ativosService.cadastrar(ativo),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'ativo',
          dados: ativo.descricao.toUpperCase(),
          acao: () => this.ativosService.atualizar(id!, ativo),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização do ativo',
              dados: ativo.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof AtivosForm) {
    this.ativosModel.update((current) => {
      const emptyValue = this.getEmptyValue(current[field]);
      return { ...current, [field]: emptyValue };
    });
  }

  /* FUNÇÃO PARA IDENTIFICAR O TIPO DE DADOS O CAMPO PERTENCE */
  private getEmptyValue(value: any): any {
    if (typeof value === 'string') return '';
    if (typeof value === 'number') return 0;
    if (typeof value === 'boolean') return false;
    if (value instanceof Date) return null;
    return null;
  }

  /* FUNÇÃO PARA RESETAR TODO O COMPONENTE */
  private resetForm(): void {
    this.ativosModel.set(INICIALIZAR_ATIVOS_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
