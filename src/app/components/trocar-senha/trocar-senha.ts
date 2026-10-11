import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogConfirmarService } from '../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../services/dialog-finalizar.service';
import {
  CamposSenhas,
  ErrorSenhaType,
  getErrorSenhaMessage,
  INICIALIZAR_SENHA_FORMS,
  SenhaForm,
  SenhaModel,
  SenhaType,
} from '../../entities/credenciais.model';
import { FormatarCampos } from '../../constants/capitalize-first.const';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_FORM,
  FINALIZAR_SUCESSO,
} from '../../entities/dialogo-finalizar.model';
import { CONFIRMAR_CADASTRAR } from '../../entities/dialogo-confirmar.model';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

/* Regex única de caracteres permitidos: usada no keypress e na sanitização,
   para o componente e o mask nunca divergirem */
const CARACTERES_PERMITIDOS = /^[0-9a-zA-ZÀ-ÿ ]$/;
const REGEX_SANITIZACAO = /[^0-9a-zA-ZÀ-ÿ ]/g;

@Component({
  selector: 'app-trocar-senha',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  templateUrl: './trocar-senha.html',
  styleUrl: './trocar-senha.scss',
})
export class TrocarSenha {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private usuarioService = inject(UsuarioService);
  private authSevice = inject(AuthService);

  /* MODELO DE ENTRADA DE DADOS DO FORMS*/
  protected senhaModel = signal<SenhaForm>(INICIALIZAR_SENHA_FORMS());

  /* Visibilidade por campo: true = mascarado (padrão), false = revelado.
   Um único signal elimina o showPassword, que era redundante com hide */
  protected hideFields = signal<Record<string, boolean>>({
    senhaAtual: true,
    novaSenha: true,
    repitaSenha: true,
  });

  /* VALIDAÇÕES DO MODELO */
  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);

  protected fieldTouched = signal<Record<string, boolean>>({});

  protected invalidCharFields = signal<Record<string, boolean>>({});

  /* FUNÇÃO QUE INTERCEPTA A TENTATIVA DE INSERIR CARACTERES INVÁLIDOS.
     - Teclas de controle (Backspace, Tab, Shift, setas, F1..F12) têm
       event.key.length > 1 e passam direto, sem preventDefault 
  */
  protected aoPressionarTecla(event: KeyboardEvent, campo: string): void {
    if (event.key.length > 1) return;

    const permitido = CARACTERES_PERMITIDOS.test(event.key);

    if (!CamposSenhas.includes(campo as keyof SenhaForm)) return;

    if (permitido) {
      /* caractere válido: limpa o erro de caractere inválido do campo */
      this.invalidCharFields.update((s) => ({ ...s, [campo]: false }));
    } else {
      /* caractere especial: bloqueia a entrada e marca o erro */
      event.preventDefault();
      this.invalidCharFields.update((s) => ({ ...s, [campo]: true }));
    }
  }

  /* SIGNAL ÚNICO COM TODOS OS ERROS.
     - Os três valores são lidos uma vez, fora do loop, para as validações
       cruzadas (equal/different) compararem valores reais, não strings vazias. 
  */
  protected erros = computed<Record<string, ErrorSenhaType>>(() => {
    const model = this.senhaModel();
    const current = (model.senhaAtual ?? '').toString().trim();
    const next = (model.novaSenha ?? '').toString().trim();
    const repeat = (model.repitaSenha ?? '').toString().trim();
    return CamposSenhas.reduce(
      (acc, campo) => {
        const value = (model[campo] ?? '').toString().trim();
        const touched = this.fieldTouched()[campo as string] ?? false;
        const invalidChar = this.invalidCharFields()[campo as string] ?? false;
        const submitted = this.formSubmitted();

        let erro: ErrorSenhaType = null;

        if (touched || submitted) {
          if (!value) {
            erro = `empty${FormatarCampos(campo)}` as ErrorSenhaType;
          } else if (campo === 'novaSenha' && next === current) {
            erro = `equal${FormatarCampos(campo)}` as ErrorSenhaType;
          } else if (campo === 'repitaSenha' && next !== repeat) {
            erro = `different${FormatarCampos(campo)}` as ErrorSenhaType;
          }
        }

        if (invalidChar && !erro) {
          erro = `invalidChar${FormatarCampos(campo)}` as ErrorSenhaType;
        }

        return { ...acc, [campo]: erro };
      },
      {} as Record<string, ErrorSenhaType>,
    );
  });

  /* FUNÇÃO QUE RETORNA O ERRO DE ACORDO COM OS ESPECIFICADOS NO MODEL */
  protected obterErro(campo: SenhaType): string {
    return getErrorSenhaMessage(this.erros()[campo] ?? null);
  }

  /* FUNÇÃO DE VALIDAÇÃO DO FORMULARIO */
  protected isFormValid = computed(() => {
    const erros = this.erros();

    return CamposSenhas.every((campo) => erros[campo as string] === null);
  });

  /* FUNÇÃO DINAMICA QUE IDENTIFICA QUANDO O CAMPO FOI TOCADO */
  protected onBlur(field: SenhaType): void {
    if (!field) return;
    this.touchedSubmitted.set(true);
    this.fieldTouched.update((state) => ({
      ...state,
      [field]: true,
    }));
  }

  /* GETTER DA ENTIDADE */
  protected getField(field: keyof SenhaForm) {
    return this.senhaModel()[field] ?? '';
  }

  /* SETTER DA ENTIDADE: sanitiza o valor (cobre paste, drag e autofill,
     que escapam do keypress) e marca o erro quando houve contaminação.
     NÃO apaga o flag de erro aqui: o flag persiste até o usuário digitar
     um caractere válido (keypress) ou o form ser resetado */
  protected setField(field: keyof SenhaForm, value: string): void {
    const sanitizado = value.replace(REGEX_SANITIZACAO, '');

    if (sanitizado !== value) {
      this.invalidCharFields.update((s) => ({ ...s, [field as string]: true }));
    }

    this.senhaModel.update((model) => ({ ...model, [field]: sanitizado }));
  }

  /* FUNÇÃO DE CADASTRO E ATUALIZAR */
  protected executar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);

    if (!this.isFormValid()) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_FORM,
        operacao: 'Cadastro da Senha',
        dados: 'Falha ao alterar a senha',
      });
      return;
    }

    const nome = this.authSevice.getPerfil()?.nome;
    const { senhaAtual, novaSenha } = this.senhaModel();
    const dados: SenhaModel = { atual: senhaAtual, novo: novaSenha };
    console.log(dados);

    this.confirmarService
      .confirmar({
        ...CONFIRMAR_CADASTRAR,
        entidade: 'senha',
        dados: `do usuário ${nome}`,
        acao: () => this.usuarioService.trocarSenha(dados),
      })
      .subscribe((confirmado) => {
        console.log(confirmado);
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.finalizarService.finalizar({
            ...FINALIZAR_SUCESSO,
            operacao: 'Cadastro da Senha',
            dados: '',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            ...FINALIZAR_ERRO,
            operacao: 'Cadastro da Senha',
            dados: '',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            ...FINALIZAR_CANCELAR,
            operacao: 'Cadastro da Senha',
            dados: '',
          });
        }
      });
  }

  // Função de visualização da senha
  /* Getter por campo para o template */
  protected isHidden(campo: string): boolean {
    return this.hideFields()[campo] ?? true;
  }

  /* Toggle por campo. Para no stopPropagation, sem submeter o form */
  protected toggleVisibility(event: MouseEvent, campo: string): void {
    event.stopPropagation();
    this.hideFields.update((state) => ({
      ...state,
      [campo]: !state[campo],
    }));
  }

  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof SenhaForm) {
    this.senhaModel.update((current) => {
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
    this.senhaModel.set(INICIALIZAR_SENHA_FORMS());
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(false);
    this.invalidCharFields.set({});
    this.fieldTouched.set({});
  }
}
