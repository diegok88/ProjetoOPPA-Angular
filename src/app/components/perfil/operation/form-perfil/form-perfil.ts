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
  CamposPerfil,
  CamposPerfilLetras,
  CamposPerfilNumeros,
  ErrorPerfilType,
  getErrorPerfilMessage,
  INICIALIZAR_PERFIL_ENTITY,
  INICIALIZAR_PERFIL_FORMS,
  PerfilForm,
  PerfilModel,
  PerfilType,
} from '../../../../entities/perfil.model';
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
import { FormatarCampos } from '../../../../constants/capitalize-first.const';

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
    <form class="container-operation-forms" (ngSubmit)="executar($event)">
      <div class="container-operation-forms-separated">
        <section class="container-operation-forms-group">
          @if (isAtualizar()) {
            <div class="container-operation-forms-update">
              <mat-list>
                <mat-list-item>
                  <span matListItemTitle>
                    <p class="list-label">Id:</p>
                    <p class="list-data">{{ buscar().id }}</p>
                  </span>
                </mat-list-item>
              </mat-list>
            </div>
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
              mask="A******************************************************************"
              (keypress)="aoPressionarTecla($event, 'descricao')"
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
              @if (obterErro('descricao')) {
                <span class="error-message" [class.show]="!!obterErro('descricao')">{{
                  obterErro('descricao')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>
        </section>
        <section class="container-operation-forms-button">
          @if (isAtualizar()) {
            <button matButton="outlined" type="submit" [disabled]="!isFormValid()">
              Atualizar
            </button>
          } @else {
            <button matButton="outlined" type="submit" [disabled]="!isFormValid()">
              Cadastrar
            </button>
          }
        </section>
      </div>
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

  /* INJEÇÃO DE DEPENDENCIA PARA BUG NO ATUALIZAR,  NÃO DETECTAVA A FLUTUAÇÃO DA LABEL */
  private cdr = inject(ChangeDetectorRef);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public listar = input<PerfilModel[] | []>([]);
  public buscar = input<PerfilModel>({ ...INICIALIZAR_PERFIL_ENTITY });
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected perfilModel = signal<PerfilForm>({ ...INICIALIZAR_PERFIL_FORMS });

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

    if (CamposPerfilLetras.includes(campo as keyof PerfilForm) && isNumbers) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
    } else if (CamposPerfilNumeros.includes(campo as keyof PerfilForm) && isLetters) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
    }
  }

  /* SIGNAL UNICO COM TODOS OS ERROS */
  protected erros = computed<Record<string, ErrorPerfilType>>(() => {
    return CamposPerfil.reduce(
      (acc, campo) => {
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const touched = this.fieldTouched()[campo as string] ?? false;
        const submitted = this.formSubmitted();
        const recordEqual = this.listar().some((item) => item[campo] === this.perfilModel()[campo]);

        let erro: ErrorPerfilType = null;

        if (touched || submitted) {
          const value = (this.perfilModel()[campo] ?? '').toString().trim().toUpperCase();
          const original = (this.buscar()[campo] ?? '').toString().trim().toUpperCase();

          if (!value) erro = `empty${FormatarCampos(campo)}` as ErrorPerfilType;
          else if (value === original) {
            erro = `equal${FormatarCampos(campo)}` as ErrorPerfilType;
          } else if (recordEqual) {
            erro = `equalList${FormatarCampos(campo)}` as ErrorPerfilType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorPerfilType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorPerfilType>,
    );
  });

  /* SIGNALS INDIVIDUAIS PARA CADA CAMPO */
  protected descricaoError = computed(() => this.erros()['descricao']);

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: PerfilType): string {
    return getErrorPerfilMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposPerfil.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: PerfilType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER E SETTER DA ENTIDADE */
  protected getField(field: keyof PerfilForm) {
    return this.perfilModel()[field] ?? '';
  }

  protected setField(field: keyof PerfilForm, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  /* INICIALIZADOR DO COMPONENTE */
  ngOnInit(): void {
    const dados = this.formatarModel();

    if (
      this.operacaoAtual() === OperationMap.REGISTRO &&
      this.registroAtual() === RecordMap.ATUALIZAR &&
      dados
    ) {
      this.perfilModel.set(dados);
      this.isAtualizar.set(true);

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.isAtualizar.set(false);
    }
  }

  // FUNÇÃO QUE SELECIONA OS ATRIBUTOS
  private formatarModel(): PerfilForm {
    const fieldsFormat = CamposPerfil.reduce((acc, c) => {
      if (this.buscar()[c] !== undefined && this.buscar()[c] !== null) {
        acc[c] = this.buscar()[c];
      }
      return acc;
    }, {} as Partial<PerfilForm>);
    return fieldsFormat as PerfilForm;
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.perfilService.listar();
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
        operacao: 'Cadastro do perfil',
        dados: this.perfilModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    if (!this.touchedSubmitted() && this.isAtualizar()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ALT,
        operacao: 'Atualização do perfil',
        dados: this.perfilModel().descricao.toLocaleUpperCase(),
      });
      return;
    }

    const perfil = this.perfilModel();
    const id = this.buscar()?.id;

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
  protected clearField(field: keyof PerfilForm) {
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
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
