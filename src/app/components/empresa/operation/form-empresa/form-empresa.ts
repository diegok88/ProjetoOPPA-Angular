import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  Signal,
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
import { NgxMaskDirective } from 'ngx-mask';
import { FormatarCampos } from '../../../../constants/capitalize-first.const';

@Component({
  selector: 'app-form-empresa',
  imports: [
    FormsModule,
    NgxMaskDirective,
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
            <mat-label>Cnpj</mat-label>
            <input
              matInput
              type="text"
              id="cnpj"
              name="cnpj"
              placeholder="Insira o cnpj da empresa"
              [ngModel]="getField('cnpj')"
              (ngModelChange)="setField('cnpj', $event)"
              mask="00.000.000/0000-00"
              (keypress)="aoPressionarTecla($event, 'cnpj')"
              (blur)="onBlur('cnpj')"
              autocomplete="off"
            />
            @if (getField('cnpj')) {
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
              @if (obterErro('cnpj')) {
                <span class="error-message" [class.show]="!!obterErro('cnpj')">{{
                  obterErro('cnpj')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Razão Social</mat-label>
            <input
              matInput
              type="text"
              id="razaoSocial"
              name="razaoSocial"
              placeholder="Insira a razão social da empresa"
              [ngModel]="getField('razaoSocial')"
              (ngModelChange)="setField('razaoSocial', $event)"
              mask="A******************************************************************"
              (keypress)="aoPressionarTecla($event, 'razaoSocial')"
              (blur)="onBlur('razaoSocial')"
              autocomplete="off"
            />
            @if (getField('razaoSocial')) {
              <!-- PARA O BOTÃO NÃO SER SUBMETIDO IGUAL A DO CADASTRAR O MESMO DEVE SER TIPADO - type="button" -->
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('razaoSocial')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('razaoSocial')) {
                <span class="error-message" [class.show]="!!obterErro('razaoSocial')">{{
                  obterErro('razaoSocial')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nome Fantasia</mat-label>
            <input
              matInput
              type="text"
              id="nomeFantasia"
              name="nomeFantasia"
              placeholder="Insira o nome fantasia da empresa"
              [ngModel]="getField('nomeFantasia')"
              (ngModelChange)="setField('nomeFantasia', $event)"
              mask="A******************************************************************"
              (keypress)="aoPressionarTecla($event, 'nomeFantasia')"
              (blur)="onBlur('nomeFantasia')"
              autocomplete="off"
            />
            @if (getField('nomeFantasia')) {
              <!-- PARA O BOTÃO NÃO SER SUBMETIDO IGUAL A DO CADASTRAR O MESMO DEVE SER TIPADO - type="button" -->
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('nomeFantasia')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('nomeFantasia')) {
                <span class="error-message" [class.show]="!!obterErro('nomeFantasia')">{{
                  obterErro('nomeFantasia')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contato</mat-label>
            <input
              matInput
              type="text"
              id="contato"
              name="contato"
              placeholder="Insira o telefone de contato"
              [ngModel]="getField('contato')"
              (ngModelChange)="setField('contato', $event)"
              (keypress)="aoPressionarTecla($event, 'contato')"
              mask="00 00000-0000"
              (blur)="onBlur('contato')"
              autocomplete="off"
            />
            @if (getField('contato')) {
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('contato')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('contato')) {
                <span class="error-message" [class.show]="!!obterErro('contato')">{{
                  obterErro('contato')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              id="email"
              name="email"
              placeholder="Insira o e-mail da empresa"
              [ngModel]="getField('email')"
              (ngModelChange)="setField('email', $event)"
              (keypress)="aoPressionarTecla($event, 'email')"
              (blur)="onBlur('email')"
              autocomplete="off"
            />
            @if (getField('email')) {
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('email')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('email')) {
                <span class="error-message" [class.show]="!!obterErro('email')">{{
                  obterErro('email')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Rua</mat-label>
            <input
              matInput
              type="text"
              id="rua"
              name="rua"
              placeholder="Insira o nome da rua"
              [ngModel]="getField('rua')"
              (ngModelChange)="setField('rua', $event)"
              mask="S******************************************************************"
              (keypress)="aoPressionarTecla($event, 'rua')"
              (blur)="onBlur('rua')"
              autocomplete="off"
            />
            @if (getField('rua')) {
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('rua')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('rua')) {
                <span class="error-message" [class.show]="!!obterErro('rua')">{{
                  obterErro('rua')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Número</mat-label>
            <input
              matInput
              type="text"
              id="numero"
              name="numero"
              placeholder="Insira o número do endereço"
              [ngModel]="getField('numero')"
              (ngModelChange)="setField('numero', $event)"
              mask="00000"
              (keypress)="aoPressionarTecla($event, 'numero')"
              (blur)="onBlur('numero')"
              autocomplete="off"
            />
            @if (getField('numero')) {
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('numero')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('numero')) {
                <span class="error-message" [class.show]="!!obterErro('numero')">{{
                  obterErro('numero')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Bairro</mat-label>
            <input
              matInput
              type="text"
              id="bairro"
              name="bairro"
              placeholder="Insira o bairro"
              [ngModel]="getField('bairro')"
              (ngModelChange)="setField('bairro', $event)"
              mask="S******************************************************************"
              (keypress)="aoPressionarTecla($event, 'bairro')"
              (blur)="onBlur('bairro')"
              autocomplete="off"
            />
            @if (getField('bairro')) {
              <button
                matSuffix
                matIconButton
                type="button"
                aria-label="Clear"
                (click)="clearField('bairro')"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            <mat-hint>
              @if (obterErro('bairro')) {
                <span class="error-message" [class.show]="!!obterErro('bairro')">{{
                  obterErro('bairro')
                }}</span>
              }
            </mat-hint>
          </mat-form-field>

          <div class="campos-menor">
            <mat-form-field appearance="outline">
              <mat-label>Cidade</mat-label>
              <input
                matInput
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Insira a cidade"
                [ngModel]="getField('cidade')"
                (ngModelChange)="setField('cidade', $event)"
                mask="S******************************************************************"
                (keypress)="aoPressionarTecla($event, 'cidade')"
                (blur)="onBlur('cidade')"
                autocomplete="off"
              />
              @if (getField('cidade')) {
                <button
                  matSuffix
                  matIconButton
                  type="button"
                  aria-label="Clear"
                  (click)="clearField('cidade')"
                >
                  <mat-icon>close</mat-icon>
                </button>
              }
              <mat-hint>
                @if (obterErro('cidade')) {
                  <span class="error-message" [class.show]="!!obterErro('cidade')">{{
                    obterErro('cidade')
                  }}</span>
                }
              </mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <input
                matInput
                type="text"
                id="estado"
                name="estado"
                placeholder="Insira o estado (UF)"
                [ngModel]="getField('estado')"
                (ngModelChange)="setField('estado', $event)"
                mask="S******************************************************************"
                (keypress)="aoPressionarTecla($event, 'estado')"
                (blur)="onBlur('estado')"
                maxlength="2"
                autocomplete="off"
              />
              @if (getField('estado')) {
                <button
                  matSuffix
                  matIconButton
                  type="button"
                  aria-label="Clear"
                  (click)="clearField('estado')"
                >
                  <mat-icon>close</mat-icon>
                </button>
              }
              <mat-hint>
                @if (obterErro('estado')) {
                  <span class="error-message" [class.show]="!!obterErro('estado')">{{
                    obterErro('estado')
                  }}</span>
                }
              </mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>CEP</mat-label>
              <input
                matInput
                type="text"
                id="cep"
                name="cep"
                placeholder="Insira o CEP"
                [ngModel]="getField('cep')"
                (ngModelChange)="setField('cep', $event)"
                mask="00000-000"
                (keypress)="aoPressionarTecla($event, 'cep')"
                (blur)="onBlur('cep')"
                autocomplete="off"
              />
              @if (getField('cep')) {
                <button
                  matSuffix
                  matIconButton
                  type="button"
                  aria-label="Clear"
                  (click)="clearField('cep')"
                >
                  <mat-icon>close</mat-icon>
                </button>
              }
              <mat-hint>
                @if (obterErro('cep')) {
                  <span class="error-message" [class.show]="!!obterErro('cep')">{{
                    obterErro('cep')
                  }}</span>
                }
              </mat-hint>
            </mat-form-field>
          </div>
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
  public listar = input<EmpresaModel[] | []>([]);
  public buscar = input<EmpresaModel>({ ...INICIALIZAR_EMPRESA_ENTITY });
  public onMudarOperacao = output<OperationType>();

  /* MODELO DE ENTRADA DE DADOS */
  protected empresaModel = signal<EmpresaForm>({ ...INICIALIZAR_EMPRESA_FORMS });

  /* VALIDAÇÕES DO MODELO */
  protected isAtualizar = signal<boolean>(false);

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);

  protected fieldTouched = signal<Record<string, boolean>>({});

  protected invalidCharFields = signal<Record<string, boolean>>({});

  /* FUNÇÃO AUXILIAR PARA TRANSFORMAR EM OS CAMPOS A PRIMEIRA LETRA EM MAIUSCULO */
  private transformarMaiusculo(campo: string): string {
    return campo.charAt(0).toUpperCase() + campo.slice(1);
  }

  /* FUNÇÃO QUE INTERCEPTA A TENTATIVA DE INSERIR CARACTERES INVALIDOS */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    const key = event.key;

    // Ignora teclas especiais (backspace, setas, tab, etc)
    //if (key.length > 1) return;

    // Verifica se a chave possui apenas os caracteres necessarios
    const isNumbers = /[0-9]/.test(key);
    const isLetters = /[a-zA-ZÀ-ÿ]/.test(key);

    if (CamposEmpresaLetras.includes(campo as keyof EmpresaForm) && isNumbers) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
    } else if (CamposEmpresaNumeros.includes(campo as keyof EmpresaForm) && isLetters) {
      this.invalidCharFields.update((state) => ({ ...state, [campo]: true }));
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
          console.log(`Valor: ${value} - Original: ${original}`);

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
    this.empresaModel.set({ ...INICIALIZAR_EMPRESA_FORMS });
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
