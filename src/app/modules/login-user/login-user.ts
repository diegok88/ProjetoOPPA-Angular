import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginData } from '../../../interfaces/login-data.interface';

@Component({
  selector: 'app-login-user',
  imports: [FormsModule],
  templateUrl: './login-user.html',
  styleUrl: './login-user.scss',
})
export class LoginUser {
  // Objeto armazena dados para o login
  protected loginModel = signal<LoginData>({ badge: '', password: '', enterprice: '' });
  // Armazena valor boleano para visualização da senha
  protected showPassword = signal<boolean>(false);
  // Estados de controle de toque/interação do usuário
  protected bagdeTouched = signal<boolean>(false);
  protected passwordTouched = signal<boolean>(false);
  protected enterpriceTouched = signal<boolean>(false);
  protected formSubmitted = signal<boolean>(false);
  // Funções de validações: executa sempre que haver mudança nos campos
  protected badgeErrorNumber = computed(() => {
    const value = this.loginModel().badge;
    const onlyNumbers = /^\d+$/.test(value);
    return !onlyNumbers && value.length > 0;
  });
  protected badgeEmptyFieldError = computed(() => {
    const value = this.loginModel().badge;
    return value.trim().length === 0;
  });
  protected passwordEmptyFieldError = computed(() => {
    const value = this.loginModel().password;
    return value.trim().length === 0;
  });
  protected enterpriceErrorNumber = computed(() => {
    const value = this.loginModel().badge;
    const onlyNumbers = /^\d+$/.test(value);
    return !onlyNumbers && value.length > 0;
  });
  protected enterpriceEmptyFieldError = computed(() => {
    const value = this.loginModel().password;
    return value.trim().length === 0;
  });
  // Validação geral somente ao enviar o post do login
  protected isFormValid = computed(() => {
    const model = this.loginModel();
    const badgeOk = model.badge.length > 0 && !this.badgeErrorNumber();
    const passwordOk = model.password.length > 0 && !this.passwordEmptyFieldError();
    const enterpriceOk = model.enterprice.length > 0 && !this.enterpriceEmptyFieldError();
    return badgeOk && passwordOk && enterpriceOk;
  });
  // Função generica de atualização todos os inputs
  protected onInput(field: keyof LoginData, value: string): void {
    this.loginModel.update((model) => ({ ...model, [field]: value }));
  }

  // Função de visualização da senha
  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
  // Função de confirmação do login
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.isFormValid()) {
      console.warn('Formulário inválido - não enviar');
      return;
    }
    console.log('Login com: ', this.loginModel());
  }
}

/*
export class LoginUser {
  protected loginModel = signal<LoginData>({ badge: '', password: '', enterprice: '' }); // Objeto armazena dados para o login
  protected badgeErrorNumber = signal<boolean>(false); // armazena valor boleano se contem ou não numeros
  protected badgeEmptyFieldError = signal<boolean>(false); // armazena valor boleano se esta vazio
  protected passwordEmptyFieldError = signal<boolean>(false); // armazena valor boleano se esta vazio
  protected showPassword = signal<boolean>(false); // armazena valor boleano para visualização da senha
  protected enterpriceErrorNumber = signal<boolean>(false); // armazena valor boleano se contem ou não numeros
  protected enterpriceEmptyFieldError = signal<boolean>(false); // armazena valor boleano se esta vazio
  // Validação geral somente ao enviar o post do login
  protected isFormValid = computed(() => {
    const model = this.loginModel();
    const badgeOk = model.badge.length > 0 && !this.badgeErrorNumber();
    const passwordOk = model.password.length > 0 && !this.passwordEmptyFieldError();
    const enterpriceOk = model.enterprice.length > 0 && !this.enterpriceEmptyFieldError();
    return badgeOk && passwordOk;
  });

  // Função para verificar se é numero ou vazio
  protected onBadgeInput(value: string): void {
    // Função de validação da variavel badge
    this.validateBadge(value);
    // Atualiza o objeto
    this.loginModel.update((model) => ({ ...model, badge: value }));
  }
  // Função de verificação se vazio
  protected onPasswordInput(value: string): void {
    this.validatePassword(value);
    this.loginModel.update((model) => ({ ...model, password: value }));
  }
  // Funções de validações
  private validateBadge(value: string): void {
    const onlyNumbers = /^\d+$/.test(value);
    // Retorno boleano que verifica se é numero e maior que 0
    this.badgeErrorNumber.set(!onlyNumbers && value.length > 0);
    // Retorno boleano se o campo estiver vazio
    this.badgeEmptyFieldError.set(value.trim().length === 0);
  }
  private validatePassword(value: string): void {
    // trim() - elimina os espaçamentos
    // length - retorna a quantidade de caracteres
    this.passwordEmptyFieldError.set(value.trim().length === 0);
  }
  // Função de visualização da senha
  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
  // Função de confirmação do login
  protected onSubmit(): void {
    // Revalida para segurança
    this.validateBadge(this.loginModel().badge);
    this.validatePassword(this.loginModel().password);
    if (!this.isFormValid()) {
      console.warn('Formulário inválido - não enviar');
      return;
    }
    console.log('Login com: ', this.loginModel());
  }
}
*/
