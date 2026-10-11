import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { CompetenciaSetorialService } from '../../../../services/competencia-setorial.service';
import {
  CamposCompetenciaSetorial,
  CompetenciaSetorialForm,
  CompetenciaSetorialModel,
  CompetenciaSetorialType,
  ErrorCompetenciaSetorialType,
  getErrorCompetenciaSetorialMessage,
  INICIALIZAR_COMPETENCIA_SETORIAL_FORMS,
} from '../../../../entities/competencia-setorial.model';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_FORM,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import {
  CONFIRMAR_CADASTRAR,
  CONFIRMAR_INATIVAR,
} from '../../../../entities/dialogo-confirmar.model';
import { OperationType } from '../../../../constants/operation-map.const';
import { SetoresModel } from '../../../../entities/setores.model';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-form-competencia-setorial',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './form-competencia-setorial.html',
  styles: `
    th.mat-mdc-header-cell:nth-child(1),
    td.mdc-data-table__cell:nth-child(1) {
      width: 15%;
    }

    th.mat-mdc-header-cell:nth-child(3),
    td.mdc-data-table__cell:nth-child(3) {
      width: 15%;
    }

    th.mat-mdc-header-cell:nth-child(4),
    td.mdc-data-table__cell:nth-child(4) {
      width: 20%;
    }
  `,
})
export class FormCompetenciaSetorial implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private competenciaSetorialService = inject(CompetenciaSetorialService);

  /* DADOS RETORNADOS DO SERVICE */
  protected readonly listarCompetencia = this.competenciaSetorialService.listarCompetenciaSetorial;
  protected readonly setores = this.competenciaSetorialService.listarCompetenciaSetorialSetores;

  /* PARAMETROS DA TABELA */
  protected displayedColumns: string[] = ['codigo', 'setor', 'status', 'acao'];

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public usuarioId = input<string | null>(null);
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected competenciaSetorialModel = signal<CompetenciaSetorialForm>(
    INICIALIZAR_COMPETENCIA_SETORIAL_FORMS(),
  );

  /* LISTA DE OPÇÕES DO SELECT - DERIVADA DOS SERVICES DA API */
  protected setoresOptions = computed(() =>
    (this.setores() ?? []).map((e: SetoresModel) => ({
      value: e.id,
      viewValue: `${e.codigo} - ${e.descricao}`,
    })),
  );

  protected usuarioValid = computed(() => {
    return this.usuario() !== this.usuarioId();
  });

  /* VALIDAÇÕES DO MODELO */
  protected usuario = signal<string | null>(null);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);

  /* VALIDAÇÕES DOS CAMPOS QUANDO TOCADOS */
  protected fieldTouched = signal<Record<string, boolean>>({});

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorCompetenciaSetorialType>>(() => {
    return CamposCompetenciaSetorial.reduce(
      (acc, campo) => {
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        let erro: ErrorCompetenciaSetorialType = null;

        if (touched || submitted) {
          const value = (this.competenciaSetorialModel()[campo] ?? '')
            .toString()
            .trim()
            .toUpperCase();

          if (!value) erro = `empty${FormatarCampos(campo)}` as ErrorCompetenciaSetorialType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorCompetenciaSetorialType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected setorError = computed(() => this.erros()['setorId']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: CompetenciaSetorialType): string {
    return getErrorCompetenciaSetorialMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposCompetenciaSetorial.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: CompetenciaSetorialType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER E SETTER DA ENTIDADE */
  protected getField(field: keyof CompetenciaSetorialForm) {
    return this.competenciaSetorialModel()[field] ?? '';
  }

  protected setField(field: keyof CompetenciaSetorialForm, value: string): void {
    this.competenciaSetorialModel.update((model) => ({ ...model, [field]: value }));
  }

  /* RESETA O FORM QUANDO UM NOVO USUÁRIO É SELECIONADO NA LISTA */
  constructor() {
    effect(() => {
      const id = this.usuarioId();
      if (id) {
        this.resetForm();
        this.carregarTodos(id).subscribe();
        this.carregarSetores(id).subscribe();
      }
    });
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    const id = this.usuarioId();
    if (id) {
      this.carregarTodos(id).subscribe();
      this.carregarSetores(id).subscribe();
    }
  }

  /* FUNÇÃO DE CARREGAMENTO OS DADOS DA ENTIDADE */
  protected carregarTodos(id: string) {
    return this.competenciaSetorialService.listarTabela(id);
  }

  /* FUNÇÃO DE CARREGAMENTO OS DADOS DA ENTIDADE */
  protected carregarSetores(id: string) {
    return this.competenciaSetorialService.listarSetores(id);
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.competenciaSetorialService.counter();
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro de Competência Setorial',
        dados: this.competenciaSetorialModel().setorId.toLocaleUpperCase(),
      });
      return;
    }

    const id = this.usuarioId()!;
    const competencia = this.competenciaSetorialModel();
    competencia.colaboradorId = id;
    const setor = this.setores()!
      .filter((s) => s.id === competencia.setorId)
      .map((s) => s.descricao);

    this.confirmarService
      .confirmar({
        ...CONFIRMAR_CADASTRAR,
        entidade: 'competencia setorial',
        dados: setor[0].toUpperCase(),
        acao: () => this.competenciaSetorialService.cadastrar(competencia),
      })
      .subscribe((confirmado) => {
        console.log(confirmado);
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.carregarTodos(id).subscribe();
          this.carregarSetores(id).subscribe();
          this.carregarContador().subscribe();
          this.finalizarService.finalizar({
            ...FINALIZAR_SUCESSO,
            operacao: 'Cadastro do competência setorial',
            dados: setor[0].toUpperCase(),
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            ...FINALIZAR_ERRO,
            operacao: 'Cadastro do competência setorial',
            dados: setor[0].toUpperCase(),
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            ...FINALIZAR_CANCELAR,
            operacao: 'Cadastro do competência setorial',
            dados: setor[0].toUpperCase(),
          });
        }
      });
  }

  protected inativar(dado: CompetenciaSetorialModel): void {
    const id = this.usuarioId()!;

    this.confirmarService
      .confirmar({
        ...CONFIRMAR_INATIVAR,
        entidade: 'competencia setorial',
        dados: ` - Setor: ${dado.setor?.descricao.toUpperCase()}`,
        acao: () => this.competenciaSetorialService.inativar(dado.id!),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.carregarTodos(id).subscribe();
          this.carregarSetores(id).subscribe();
          this.carregarContador().subscribe();
          this.finalizarService.finalizar({
            ...FINALIZAR_SUCESSO,
            operacao: 'Inativação da Competência Setorial',
            dados: ` - Setor: ${dado.setor?.descricao.toUpperCase()}`,
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            ...FINALIZAR_ERRO,
            operacao: 'Inativação da Competência Setorial',
            dados: ` - Setor: ${dado.setor?.descricao.toUpperCase()}`,
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            ...FINALIZAR_CANCELAR,
            operacao: 'Inativação da Competência Setorial',
            dados: ` - Setor: ${dado.setor?.descricao.toUpperCase()}`,
          });
        }
      });
  }

  /* FUNÇÃO PARA RESETAR TODO O COMPONENTE */
  private resetForm(): void {
    this.competenciaSetorialModel.set(INICIALIZAR_COMPETENCIA_SETORIAL_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.fieldTouched.set({});
  }
}
