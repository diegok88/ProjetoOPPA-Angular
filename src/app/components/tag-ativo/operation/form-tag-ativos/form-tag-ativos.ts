import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';
import {
  OperationType,
  RecordType,
  OperationMap,
  RecordMap,
} from '../../../../constants/operation-map.const';
import { AtivosModel } from '../../../../entities/ativos.model';
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
import {
  TagAtivosModel,
  INICIALIZAR_TAGATIVOS_ENTITY,
  TagAtivosForm,
  INICIALIZAR_TAGATIVOS_FORMS,
  ErrorTagAtivosType,
  CamposTagAtivos,
  TagAtivosType,
  getErrorTagAtivosMessage,
  CamposTagAtivosLivres,
} from '../../../../entities/tag-ativo.model';
import { AtivosService } from '../../../../services/ativos.service';
import { AuthService } from '../../../../services/auth.service';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { TagAtivosService } from '../../../../services/tag-ativo.service';

/* Regex única de caracteres permitidos: usada no keypress e na sanitização,
   para o componente e o mask nunca divergirem */
const CARACTERES_PERMITIDOS = /^[0-9a-zA-ZÀ-ÿ ]$/;
const REGEX_SANITIZACAO = /[^0-9a-zA-ZÀ-ÿ ]/g;

@Component({
  selector: 'app-form-tag-ativos',
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
  templateUrl: './form-tag-ativos.html',
  styles: ``,
})
export class FormTagAtivos implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private authService = inject(AuthService);
  private tagAtivosService = inject(TagAtivosService);
  private ativosService = inject(AtivosService);

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR, NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscar = input<TagAtivosModel>(INICIALIZAR_TAGATIVOS_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected tagAtivosModel = signal<TagAtivosForm>(INICIALIZAR_TAGATIVOS_FORMS());

  /* SIGNAL READONLY DO SERVICE: o listar() preenche o signal interno
     via tap e o componente apenas lê - padrão do listarEmpresa */
  private readonly listarAtivos = this.ativosService.listarAtivos;

  /* OPÇÕES DO SELECT DERIVADAS POR COMPUTED:
     - Reage automaticamente quando a resposta do listar() chega ao service
     - Sem signal local e sem set() manual no subscribe
     - Se o campo de exibição do Ativos não for 'descricao', ajuste aqui */
  protected ativosOptions = computed(() =>
    (this.listarAtivos() ?? []).map((a: AtivosModel) => ({
      value: a.id ?? '',
      viewValue: `${a.codigo} - ${a.descricao} ${a.modelo}`,
    })),
  );

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);
  protected formSubmitted = signal<boolean>(false);
  protected touchedSubmitted = signal<boolean>(false);
  protected fieldTouched = signal<Record<string, boolean>>({});
  protected invalidCharFields = signal<Record<string, boolean>>({});

  /*
  FUNÇÃO QUE INTERCEPTA A TENTATIVA DE INSERIR CARACTERES INVALIDOS:
  - Aplica-se apenas aos campos de senha (ativoId é select, sem digitação).
  - Letras, números e acentos passam; caracteres especiais são
    bloqueados e marcados como erro.
  */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    if (event.key.length > 1) return;

    const permitido = CARACTERES_PERMITIDOS.test(event.key);

    if (!CamposTagAtivosLivres.includes(campo as keyof TagAtivosForm)) return;

    if (permitido) {
      /* caractere válido: limpa o erro de caractere inválido do campo */
      this.invalidCharFields.update((s) => ({ ...s, [campo]: false }));
    } else {
      /* caractere especial: bloqueia a entrada e marca o erro */
      event.preventDefault();
      this.invalidCharFields.update((s) => ({ ...s, [campo]: true }));
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorTagAtivosType>>(() => {
    return CamposTagAtivos.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        let erro: ErrorTagAtivosType = null;

        if (touched || submitted) {
          const value = (this.tagAtivosModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();
          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorTagAtivosType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorTagAtivosType;
          }
        }
        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorTagAtivosType;
        }
        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorTagAtivosType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected ativoIdError = computed(() => this.erros()['ativoId']);
  protected senhaError = computed(() => this.erros()['senha']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: TagAtivosType): string {
    return getErrorTagAtivosMessage(this.erros()[campo] ?? null);
  }
  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();
    return CamposTagAtivos.every((campo) => erros[campo as string] === null);
  });
  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: TagAtivosType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }
  /* GETTER DA ENTIDADE */
  protected getField(field: keyof TagAtivosForm) {
    return this.tagAtivosModel()[field] ?? '';
  }

  /* SETTER DA ENTIDADE: sanitiza o valor (cobre paste, drag e autofill,
     que escapam do keypress) e marca o erro quando houve contaminação.
     NÃO apaga o flag de erro aqui: o flag persiste até o usuário digitar
     um caractere válido (keypress) ou o form ser resetado */
  protected setField(field: keyof TagAtivosForm, value: string): void {
    const valor = field === 'senha' ? value.replace(REGEX_SANITIZACAO, '') : value;

    if (field === 'senha' && valor !== value) {
      this.invalidCharFields.update((s) => ({ ...s, [field as string]: true }));
    }

    this.tagAtivosModel.update((model) => ({ ...model, [field]: valor }));
  }

  /* INICIALIZADOR DO COMPONENTE:
     - Apenas dispara a requisição de ativos: o computed ativosOptions
       atualiza o select sozinho quando a resposta chegar
     - Carrega o modelo no modo ATUALIZAR */
  ngOnInit(): void {
    this.carregarAtivos().subscribe();
    const dados = this.formatarModel();
    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.tagAtivosModel.set(dados);
      this.isAtualizar.set(true);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS (todos os campos da tag são string)
  private formatarModel(): TagAtivosForm {
    const fieldsFormat = CamposTagAtivos.reduce((acc, c) => {
      const valor = this.buscar()[c];
      if (valor !== undefined && valor !== null) {
        acc[c] = String(valor);
      }
      return acc;
    }, {} as Partial<TagAtivosForm>);
    return fieldsFormat as TagAtivosForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.tagAtivosService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO OS DADOS DA ENTIDADE (ativos para o select) */
  protected carregarAtivos() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao,modelo';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.ativosService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.tagAtivosService.counter();
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();

    const ativo = this.listarAtivos().find((a) => a.id === this.tagAtivosModel().ativoId);
    const desAtivo = `${ativo?.descricao} - ${ativo?.modelo}`;

    if (this.isFormValid() && !this.isAtualizar()) {
      this.formSubmitted.set(true);
    }

    if (!this.isFormValid() && !this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro da tag',
        dados: desAtivo,
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização da tag',
        dados: this.tagAtivosModel().ativoId.toLocaleUpperCase(),
      });
      return;
    }

    const form = this.tagAtivosModel();

    const id = this.buscar()?.id;
    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'tag de ativo',
          dados: desAtivo,
          acao: () => this.tagAtivosService.cadastrar(form),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro da tag de ativo',
              dados: desAtivo,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro da tag de ativo',
              dados: desAtivo,
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro da tag de ativo',
              dados: desAtivo,
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'tag de ativo',
          dados: desAtivo,
          acao: () => this.tagAtivosService.atualizar(id!, form),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização da tag de ativo',
              dados: desAtivo,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização da tag de ativo',
              dados: desAtivo,
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização da tag de ativo',
              dados: desAtivo,
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof TagAtivosForm) {
    this.tagAtivosModel.update((current) => {
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
    this.tagAtivosModel.set(INICIALIZAR_TAGATIVOS_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
