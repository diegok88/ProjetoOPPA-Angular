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
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { SolucoesService } from '../../../../services/solucoes.service';
import { FalhasService } from '../../../../services/falhas.service';

import { AuthService } from '../../../../services/auth.service';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';
import {
  CONFIRMAR_CADASTRAR,
  CONFIRMAR_ATUALIZAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_ALT,
  FINALIZAR_ERRO_FORM,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import {
  SolucoesForm,
  INICIALIZAR_SOLUCOES_FORMS,
  SolucoesModel,
  INICIALIZAR_SOLUCOES_ENTITY,
  CamposSolucoesLivres,
  ErrorSolucoesType,
  CamposSolucoes,
  SolucoesType,
  getErrorSolucoesMessage,
} from '../../../../entities/solucoes.model';
import { PerfilService } from '../../../../services/perfil.service';
import { PerfilModel } from '../../../../entities/perfil.model';
import { FalhasModel } from '../../../../entities/falhas.model';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';

const CARACTERES_PERMITIDOS = /^[0-9a-zA-ZÀ-ÿ ]$/;
const REGEX_SANITIZACAO = /[^0-9a-zA-ZÀ-ÿ ]/g;

@Component({
  selector: 'app-form-solucoes',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './form-solucoes.html',
  styles: ``,
})
export class FormSolucoes implements OnInit {
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  private solucoesService = inject(SolucoesService);
  private falhasService = inject(FalhasService);
  private perfisService = inject(PerfilService);
  private authService = inject(AuthService);

  private cdr = inject(ChangeDetectorRef);

  public operacaoAtual = input<OperationType | undefined>();
  public registroAtual = input<RecordType | undefined>();
  public buscar = input<SolucoesModel>(INICIALIZAR_SOLUCOES_ENTITY());
  public onMudarOperacao = output<OperationType>();

  protected solucoesModel = signal<SolucoesForm>(INICIALIZAR_SOLUCOES_FORMS());

  private listarPerfis = this.perfisService.listarPerfil;
  private listarFalhas = this.falhasService.listarFalhas;

  protected perfisOptions = computed(() =>
    (this.listarPerfis() ?? []).map((p: PerfilModel) => ({
      value: p.id ?? '',
      viewValue: `${p.descricao} - ${p.nivel}`,
    })),
  );

  protected falhasOptions = computed(() =>
    (this.listarFalhas() ?? []).map((f: FalhasModel) => ({
      value: f.id ?? '',
      viewValue: `${f.codigo} - ${f.descricao}`,
    })),
  );

  protected isAtualizar = computed(
    () =>
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR,
  );

  protected formSubmitted = signal<boolean>(false);
  protected touchedSubmitted = signal<boolean>(false);
  protected fieldTouched = signal<Record<string, boolean>>({});
  protected invalidCharFields = signal<Record<string, boolean>>({});

  protected aoPressionarTecla(event: KeyboardEvent, field: keyof SolucoesForm): void {
    if (event.key.length > 1) return;
    const permitido = CARACTERES_PERMITIDOS.test(event.key);
    if (!CamposSolucoesLivres.includes(field)) return;
    if (permitido) {
      this.invalidCharFields.update((s) => ({ ...s, [field]: false }));
    } else {
      event.preventDefault();
      this.invalidCharFields.update((s) => ({ ...s, [field]: true }));
    }
  }

  protected erros = computed<Record<string, ErrorSolucoesType>>(() => {
    return CamposSolucoes.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();
        let erro: ErrorSolucoesType = null;
        if (touched || submitted) {
          const value = (this.solucoesModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();
          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorSolucoesType;
          } else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorSolucoesType;
          }
        }
        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorSolucoesType;
        }
        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorSolucoesType>,
    );
  });

  protected obterErro(campo: SolucoesType): string {
    return getErrorSolucoesMessage(this.erros()[campo] ?? null);
  }

  protected isFormValid = computed(() => {
    const erros = this.erros();
    return CamposSolucoes.every((campo) => erros[campo as string] === null);
  });

  protected onBlur(field: SolucoesType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  protected getField(field: keyof SolucoesForm): string {
    return this.solucoesModel()[field] ?? '';
  }

  protected setField(field: keyof SolucoesForm, value: string): void {
    const valor = CamposSolucoesLivres.includes(field)
      ? value.replace(REGEX_SANITIZACAO, '')
      : value;
    if (CamposSolucoesLivres.includes(field) && valor !== value) {
      this.invalidCharFields.update((s) => ({ ...s, [field as string]: true }));
    }
    this.solucoesModel.update((model) => ({ ...model, [field]: valor }));
  }

  ngOnInit(): void {
    this.carregarFalhas().subscribe();
    this.carregarPerfis().subscribe();
    console.log(this.isAtualizar(), this.buscar()?.id);
    if (this.isAtualizar() && this.buscar()?.id) {
      const dados = this.preencherFormulario();
      this.solucoesModel.set(dados);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  private preencherFormulario(): SolucoesForm {
    const fieldsFormat = CamposSolucoes.reduce((acc, c) => {
      const valor = this.buscar()[c];
      if (valor !== undefined && valor !== null) {
        acc[c] = String(valor);
      }
      return acc;
    }, {} as Partial<SolucoesForm>);
    return fieldsFormat as SolucoesForm;
  }

  protected carregarFalhas() {
    const campos = 'id,codigo,descricao';
    const query = `campos=${campos}`;
    return this.falhasService.listar(query);
  }

  protected carregarPerfis() {
    const campos = 'id,descricao,nivel';
    const query = `campos=${campos}`;
    return this.perfisService.listar(query);
  }

  protected executar(event: Event): void {
    event.preventDefault();

    const id = this.buscar()?.id;
    const isAtualizar = this.isAtualizar();
    const dados = this.solucoesModel();

    if (this.isFormValid() && !this.isAtualizar()) {
      this.formSubmitted.set(true);
    }

    if (!this.isFormValid() && !this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro da solução',
        dados: dados.descricao.toUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização da solução',
        dados: dados.descricao.toUpperCase(),
      });
      return;
    }

    this.confirmarService
      .confirmar({
        ...(isAtualizar ? CONFIRMAR_ATUALIZAR : CONFIRMAR_CADASTRAR),
        entidade: 'solução',
        dados: this.solucoesModel().descricao.toUpperCase(),
        acao: () =>
          isAtualizar
            ? this.solucoesService.atualizar(id!, dados)
            : this.solucoesService.cadastrar(dados),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.finalizarService.finalizar({
            ...FINALIZAR_SUCESSO,
            operacao: isAtualizar ? 'Atualização da solução' : 'Cadastro da solução',
            dados: this.solucoesModel().descricao,
          });
          isAtualizar
            ? this.onMudarOperacao.emit(OperationMap.REGISTRO)
            : this.onMudarOperacao.emit(OperationMap.SUB_LISTA);
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            ...FINALIZAR_ERRO,
            operacao: isAtualizar ? 'Atualização da solução' : 'Cadastro da solução',
            dados: this.solucoesModel().descricao.toLocaleUpperCase(),
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            ...FINALIZAR_CANCELAR,
            operacao: isAtualizar ? 'Atualização da solução' : 'Cadastro da solução',
            dados: this.solucoesModel().descricao.toLocaleUpperCase(),
          });
        }
      });
  }

  protected clearField(field: keyof SolucoesForm) {
    this.solucoesModel.update((current) => {
      const emptyValue = this.getEmptyValue(current[field]);
      return { ...current, [field]: emptyValue };
    });
  }

  private getEmptyValue(value: any): any {
    if (typeof value === 'string') return '';
    if (typeof value === 'number') return 0;
    if (typeof value === 'boolean') return false;
    if (value instanceof Date) return null;
    return null;
  }

  private resetForm(): void {
    this.solucoesModel.set(INICIALIZAR_SOLUCOES_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
