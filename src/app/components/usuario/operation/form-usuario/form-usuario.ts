import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { UsuarioService } from '../../../../services/usuario.service';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';
import {
  CamposUsuario,
  CamposUsuarioData,
  CamposUsuarioLetras,
  CamposUsuarioNumeros,
  ErrorUsuarioType,
  Escalas,
  EscalaType,
  getErrorUsuarioMessage,
  INICIALIZAR_USUARIO_ENTITY,
  INICIALIZAR_USUARIO_FORMS,
  Turnos,
  TurnoType,
  UsuarioForm,
  UsuarioModel,
  UsuarioType,
} from '../../../../entities/usuario.model';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_ALT,
  FINALIZAR_ERRO_FORM,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import {
  CONFIRMAR_ATUALIZAR,
  CONFIRMAR_CADASTRAR,
} from '../../../../entities/dialogo-confirmar.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { DateBrAdapter } from '../../../../services/data-br-adaptador.service';
import { PerfilModel } from '../../../../entities/perfil.model';
import { MatSelectModule } from '@angular/material/select';
import { EmpresaService } from '../../../../services/empresa.service';
import { PerfilService } from '../../../../services/perfil.service';
import { EmpresaModel } from '../../../../entities/empresa.model';
import { GestorService } from '../../../../services/gestor.service';
import { AuthService } from '../../../../services/auth.service';
import { ROLES_MAP } from '../../../../constants/role-map.const';

@Component({
  selector: 'app-form-usuario',
  imports: [
    FormsModule,
    NgxMaskDirective,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './form-usuario.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: DateBrAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class FormUsuario {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private usuarioService = inject(UsuarioService);
  private gestorService = inject(GestorService);
  private empresaService = inject(EmpresaService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR,  NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* DADOS DE ENTIDADES EXTERNAS*/
  protected empresa = this.empresaService.listarEmpresa;
  protected perfil = this.perfilService.listarPerfil;

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public listar = input<UsuarioModel[] | []>([]);
  public buscar = input<UsuarioModel>(INICIALIZAR_USUARIO_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS DO FORMS*/
  protected usuarioModel = signal<UsuarioForm>(INICIALIZAR_USUARIO_FORMS());

  /* LISTA DE OPÇÕES DO SELECT - DERIVADA DAS CONSTANTES NO ARQUIVO model.ts */
  protected escalasOptions = Object.entries(Escalas).map(([chave, valor]) => ({
    value: valor as EscalaType,
    viewValue: chave === '' ? '' : `Escala ${valor}`,
  }));

  protected turnosOptions = Object.entries(Turnos).map(([chave, valor]) => ({
    value: valor as TurnoType,
    viewValue: chave === '' ? '' : `${valor}`,
  }));

  /* LISTA DE OPÇÕES DO SELECT - DERIVADA DOS SERVICES DA API */
  protected empresaOptions = computed(() =>
    (this.empresa() ?? []).map((e: EmpresaModel) => ({
      value: e.id,
      viewValue: e.razaoSocial,
    })),
  );

  protected perfilOptions = computed(() =>
    (this.perfil() ?? []).map((p: PerfilModel) => ({
      value: p.id,
      viewValue: p.descricao + ' - ' + p.nivel,
    })),
  );

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);

  protected fieldTouched = signal<Record<string, boolean>>({});

  protected invalidCharFields = signal<Record<string, boolean>>({});

  protected invalidDateFields = signal<Record<string, boolean>>({});

  /* FUNÇÃO QUE INTERCEPTA A TENTATIVA DE INSERIR CARACTERES INVALIDOS */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    const key = event.key;

    const isNumbers = /[0-9]/.test(key);
    const isLetters = /[a-zA-ZÀ-ÿ]/.test(key);

    if (CamposUsuarioLetras.includes(campo as keyof UsuarioForm)) {
      if (isNumbers) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: false }));
      }
    } else if (CamposUsuarioNumeros.includes(campo as keyof UsuarioForm)) {
      if (isLetters) {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
      } else {
        this.invalidCharFields.update((state) => ({ ...state, [campo]: false }));
      }
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorUsuarioType>>(() => {
    return CamposUsuario.reduce(
      (acc, campo) => {
        const touched = this.fieldTouched()[campo as string] ?? false;
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        /* Condicional com o intuito de pular o campo empresaId e retorna-lo nulo */
        if (campo === 'empresaId' && !this.formAuthorization()) {
          return { ...acc, [campo]: null };
        }

        let erro: ErrorUsuarioType = null;

        if (touched || submitted) {
          const isDate = CamposUsuarioData.includes(campo as keyof UsuarioForm);
          const dataInvalida = this.invalidDateFields()[campo as string] ?? false;

          const value = isDate
            ? this.dataParaIso(this.usuarioModel()[campo])
            : (this.usuarioModel()[campo] ?? '').toString().trim().toUpperCase();

          const original = isDate
            ? this.dataParaIso(this.converterData(this.buscar()[campo] as unknown))
            : (this.buscar()[campo] ?? '').toString().trim().toUpperCase();

          if (isDate && dataInvalida) {
            erro = `invalidDate${FormatarCampos(campo)}` as ErrorUsuarioType; // ← ANTES do empty
          } else if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorUsuarioType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorUsuarioType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorUsuarioType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorUsuarioType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected nomeError = computed(() => this.erros()['nome']);
  protected dataNascimentoError = computed(() => this.erros()['dataNascimento']);
  protected dataAdmissaoError = computed(() => this.erros()['dataAdmissao']);
  protected perfilIdError = computed(() => this.erros()['perfilId']);
  protected turnoError = computed(() => this.erros()['turno']);
  protected escalaError = computed(() => this.erros()['escala']);
  protected empresaIdError = computed(() => this.erros()['empresaId']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: UsuarioType): string {
    return getErrorUsuarioMessage(this.erros()[campo] ?? null);
  }

  protected formAuthorization = computed(() => {
    if (this.authService.getRole() === ROLES_MAP.ASN1) {
      return true;
    }
    return false;
  });

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = { ...this.erros() };

    if (!this.formAuthorization) {
      erros['empresaId'] = null;
    }

    return CamposUsuario.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: UsuarioType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER DA ENTIDADE */
  protected getField(field: keyof UsuarioForm) {
    const valor = this.usuarioModel()[field];
    if (CamposUsuarioData.includes(field)) {
      return valor ?? null;
    }
    return valor ?? '';
  }

  /* SETTER DA ENTIDADE */
  protected setField(field: keyof UsuarioForm, value: unknown): void {
    if (CamposUsuarioData.includes(field)) {
      const data = this.converterData(value);
      if (data !== null || value === null || value === '') {
        this.usuarioModel.update((model) => ({ ...model, [field]: data }));
      }

      if (data !== null) {
        this.invalidDateFields.update((state) => {
          const novo = { ...state };
          delete novo[field as string];
          return novo;
        });
      }
    } else {
      this.usuarioModel.update((model) => ({ ...model, [field]: value }));

      this.invalidCharFields.update((state) => {
        const novo = { ...state };
        delete novo[field as string];
        return novo;
      });
    }
  }

  /* FUNÇÃO DE CONVERSÃO DE OBJETO DESCONHECIDO EM TIPO DATE */
  private converterData(value: unknown): Date | null {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }
    if (typeof value !== 'string') return null;

    const valor = value.trim();
    if (valor === '') return null;

    const br = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      const day = Number(br[1]);
      const month = Number(br[2]);
      const year = Number(br[3]);
      if (month < 1 || month > 12 || day < 1 || day > 31) return null;
      const data = new Date(year, month - 1, day);
      if (data.getDate() !== day || data.getMonth() !== month - 1) return null;
      return data;
    }

    const iso = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      const data = new Date(+iso[1], +iso[2] - 1, +iso[3]);
      return isNaN(data.getTime()) ? null : data;
    }

    return null;
  }

  /* FUNÇÃO DE APLICAÇÃO DE MASCARA DE DIGITAÇÃO E VALIDADOR DE DATA */
  protected filtrarDataInput(event: Event, campo: string): void {
    const input = event.target as HTMLInputElement;
    const limpo = input.value.replace(/[^\d]/g, '').slice(0, 8);
    const formatado =
      limpo.slice(0, 2) +
      (limpo.length > 2 ? '/' + limpo.slice(2, 4) : '') +
      (limpo.length > 4 ? '/' + limpo.slice(4, 8) : '');
    if (formatado !== input.value) {
      input.value = formatado;
    }

    const digitadaCompleta = /^\d{2}\/\d{2}\/\d{4}$/.test(input.value);
    const data = this.converterData(input.value);

    this.invalidDateFields.update((state) => {
      const novo = { ...state };
      if (digitadaCompleta && data === null) {
        novo[campo] = true;
      } else if (digitadaCompleta) {
        delete novo[campo];
      }
      return novo;
    });
  }

  /* FUNÇÃO FUNÇÃO DE CONVERSÃO PARA STRING EM FORMATO ISO */
  private dataParaIso(valor: unknown): string {
    if (valor instanceof Date && !isNaN(valor.getTime())) {
      const mes = String(valor.getMonth() + 1).padStart(2, '0');
      const dia = String(valor.getDate()).padStart(2, '0');
      return `${valor.getFullYear()}-${mes}-${dia}`;
    }
    return '';
  }

  ngOnInit(): void {
    this.inicializarForm();
    if (this.formAuthorization()) {
      this.carregarEmpresa().subscribe();
    }
    this.carregarPerfil().subscribe();
  }

  /* FUNÇÃO DE CARREGAMENTO DE DADOS DE ENTIDADES EXTERNAS PARA SELECTS */
  private carregarEmpresa() {
    return this.empresaService.listarTabela();
  }

  private carregarPerfil() {
    return this.perfilService.listarTabela();
  }

  /* FUNÇÃO DE INICIALIZAÇÃO DA CLASSE */
  private inicializarForm(): void {
    const dados = this.formatarModel();

    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.usuarioModel.set(dados);
      this.isAtualizar.set(true);

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
      this.usuarioModel.set(INICIALIZAR_USUARIO_FORMS());
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS
  private formatarModel(): UsuarioForm {
    const fieldDate = new Set<string>(CamposUsuarioData);
    const source = this.buscar() as unknown as Record<string, unknown>;

    const fieldsFormat = CamposUsuario.reduce((acc, c) => {
      const value = source[c];
      if (value != null && value !== '') {
        (acc as Record<string, unknown>)[c] = fieldDate.has(c)
          ? this.converterData(value) // ← aqui está a correção
          : value;
      }
      return acc;
    }, {} as Partial<UsuarioForm>);

    return { ...INICIALIZAR_USUARIO_FORMS(), ...fieldsFormat } as UsuarioForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregarTodos() {
    return this.gestorService.listarTabela();
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONATDOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.gestorService.counter();
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
        operacao: 'Cadastro do usuário',
        dados: this.usuarioModel().nome.toLocaleUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização do usuário',
        dados: this.usuarioModel().nome.toLocaleUpperCase(),
      });
      return;
    }

    const usuario = this.usuarioModel();
    const id = this.buscar()?.id;

    if (!this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_CADASTRAR,
          entidade: 'empresa',
          dados: usuario.nome.toUpperCase(),
          acao: () => this.usuarioService.cadastrar(usuario),
        })
        .subscribe((confirmado) => {
          console.log(confirmado);
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregarTodos().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Cadastro do empresa',
              dados: usuario.nome.toUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Cadastro do empresa',
              dados: usuario.nome.toUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Cadastro do empresa',
              dados: usuario.nome.toUpperCase(),
            });
          }
        });
    }
    if (this.isAtualizar()) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATUALIZAR,
          entidade: 'empresa',
          dados: usuario.nome.toUpperCase(),
          acao: () => this.usuarioService.atualizar(id!, usuario),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.resetForm();
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregarTodos().subscribe();

            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Atualização do empresa',
              dados: usuario.nome.toUpperCase(),
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Atualização do empresa',
              dados: usuario.nome.toUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Atualização do empresa',
              dados: usuario.nome.toUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof UsuarioForm): void {
    const valorAtual = this.usuarioModel()[field];

    if (CamposUsuarioData.includes(field)) {
      this.usuarioModel.update((model) => ({ ...model, [field]: null }));

      this.invalidDateFields.update((state) => {
        const novo = { ...state };
        delete novo[field as string];
        return novo;
      });
    } else {
      const emptyValue = this.getEmptyValue(valorAtual);
      this.usuarioModel.update((model) => ({ ...model, [field]: emptyValue }));
    }
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
    this.usuarioModel.set(INICIALIZAR_USUARIO_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.invalidDateFields.set({});
    this.fieldTouched.set({});
  }
}
