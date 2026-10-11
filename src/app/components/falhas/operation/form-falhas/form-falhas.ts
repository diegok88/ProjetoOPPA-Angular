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

import { AtivosService } from '../../../../services/ativos.service';
import { AuthService } from '../../../../services/auth.service';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { FalhasService } from '../../../../services/falhas.service';
import { PerfilService } from '../../../../services/perfil.service';
import {
  FalhasModel,
  INICIALIZAR_FALHAS_ENTITY,
  FalhasForm,
  INICIALIZAR_FALHAS_FORMS,
  CamposFalhasLivres,
  ErrorFalhasType,
  CamposFalhas,
  FalhasType,
  getErrorFalhasMessage,
} from '../../../../entities/falhas.model';
/* Regex única de caracteres permitidos: usada no keypress e na sanitização,
   para o componente e o mask nunca divergirem */
const CARACTERES_PERMITIDOS = /^[0-9a-zA-ZÀ-ÿ ]$/;
const REGEX_SANITIZACAO = /[^0-9a-zA-ZÀ-ÿ ]/g;
@Component({
  selector: 'app-form-falhas',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './form-falhas.html',
  styles: ``,
})
export class FormFalhas implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private authService = inject(AuthService);
  private falhasService = inject(FalhasService);
  private ativosService = inject(AtivosService);
  private perfilService = inject(PerfilService);
  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR, NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);
  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscar = input<FalhasModel>(INICIALIZAR_FALHAS_ENTITY());
  public onMudarOperacao = output<OperationType>();
  /* MODELO DE ENTRADA DE DADOS */
  protected falhasModel = signal<FalhasForm>(INICIALIZAR_FALHAS_FORMS());
  /* SIGNAL READONLY DO SERVICE: o listar() preenche o signal interno
     via tap e o componente apenas lê - padrão do listarEmpresa */
  private readonly listarAtivos = this.ativosService.listarAtivos;
  private readonly listarPerfis = this.perfilService.listarPerfil;
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
  /* OPÇÕES DO SELECT DE DIRECIONAMENTO (perfis):
     - Se o campo de exibição do Perfil não for 'nome', ajuste aqui */
  protected perfisOptions = computed(() =>
    (this.listarPerfis() ?? []).map((p: any) => ({
      value: p.id ?? '',
      viewValue: `${p.descricao} - ${p.nivel}`,
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
  - Aplica-se apenas aos campos livres (descricao).
  - Letras, números e acentos passam; caracteres especiais são
    bloqueados e marcados como erro.
  */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    if (event.key.length > 1) return;
    const permitido = CARACTERES_PERMITIDOS.test(event.key);
    if (!CamposFalhasLivres.includes(campo as keyof FalhasForm)) return;
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
  protected erros = computed<Record<string, ErrorFalhasType>>(() => {
    return CamposFalhas.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();
        let erro: ErrorFalhasType = null;
        if (touched || submitted) {
          const value = (this.falhasModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();
          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorFalhasType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorFalhasType;
          }
        }
        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorFalhasType;
        }
        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorFalhasType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected codigoError = computed(() => this.erros()['codigo']);
  protected descricaoError = computed(() => this.erros()['descricao']);
  protected ativoIdError = computed(() => this.erros()['ativoId']);
  protected direcionamentoIdError = computed(() => this.erros()['direcionamentoId']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: FalhasType): string {
    return getErrorFalhasMessage(this.erros()[campo] ?? null);
  }
  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();
    return CamposFalhas.every((campo) => erros[campo as string] === null);
  });
  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: FalhasType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }
  /* GETTER DA ENTIDADE */
  protected getField(field: keyof FalhasForm) {
    return this.falhasModel()[field] ?? '';
  }
  /* SETTER DA ENTIDADE: sanitiza o valor (cobre paste, drag e autofill,
     que escapam do keypress) e marca o erro quando houve contaminação.
     NÃO apaga o flag de erro aqui: o flag persiste até o usuário digitar
     um caractere válido (keypress) ou o form ser resetado */
  protected setField(field: keyof FalhasForm, value: string): void {
    const valor = CamposFalhasLivres.includes(field) ? value.replace(REGEX_SANITIZACAO, '') : value;
    if (CamposFalhasLivres.includes(field) && valor !== value) {
      this.invalidCharFields.update((s) => ({ ...s, [field as string]: true }));
    }
    this.falhasModel.update((model) => ({ ...model, [field]: valor }));
  }
  /* INICIALIZADOR DO COMPONENTE:
     - Apenas dispara as requisições de ativos e perfis: os computed
       ativosOptions e perfisOptions atualizam os selects sozinhos quando
       as respostas chegarem
     - Carrega o modelo no modo ATUALIZAR */
  ngOnInit(): void {
    this.carregarAtivos().subscribe();
    this.carregarPerfis().subscribe();
    const dados = this.formatarModel();
    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.falhasModel.set(dados);
      this.isAtualizar.set(true);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }
  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS (todos os campos da falha são string)
  private formatarModel(): FalhasForm {
    const fieldsFormat = CamposFalhas.reduce((acc, c) => {
      const valor = this.buscar()[c];
      if (valor !== undefined && valor !== null) {
        acc[c] = String(valor);
      }
      return acc;
    }, {} as Partial<FalhasForm>);
    return fieldsFormat as FalhasForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.falhasService.listar(query);
  }
  /* FUNÇÃO DE CARREGAMENTO OS DADOS DAS ENTIDADES (ativos e perfis para os selects) */
  protected carregarAtivos() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao,modelo';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.ativosService.listar(query);
  }
  protected carregarPerfis() {
    const campos = 'id,descricao,nivel';
    const query = `campos=${campos}`;
    return this.perfilService.listar(query);
  }
  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.falhasService.counter();
  }
  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();

    const desFalha = this.falhasModel().descricao.toLocaleUpperCase();

    if (this.isFormValid() && !this.isAtualizar()) {
      this.formSubmitted.set(true);
    }

    if (!this.isFormValid() && !this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro da falha',
        dados: desFalha,
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização da falha',
        dados: desFalha,
      });
      return;
    }

    const form = this.falhasModel();
    const id = this.buscar()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'falha',
          dados: desFalha,
          acao: () => this.falhasService.cadastrar(form),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro da falha',
              dados: desFalha,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro da falha',
              dados: desFalha,
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro da falha',
              dados: desFalha,
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'falha',
          dados: desFalha,
          acao: () => this.falhasService.atualizar(id!, form),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização da falha',
              dados: desFalha,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização da falha',
              dados: desFalha,
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização da falha',
              dados: desFalha,
            });
          }
        });
    }
  }
  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof FalhasForm) {
    this.falhasModel.update((current) => {
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
    this.falhasModel.set(INICIALIZAR_FALHAS_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
