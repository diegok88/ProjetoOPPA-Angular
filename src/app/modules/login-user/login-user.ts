import { Component, computed, signal } from '@angular/core';
import { LoginData } from '../../../interfaces/login-data.interface';

@Component({
  selector: 'app-login-user',
  imports: [],
  templateUrl: './login-user.html',
  styleUrl: './login-user.scss',
})
export class LoginUser {
  protected loginModel = signal<LoginData>({ badge: '', password: '' }); // Objeto armazena dados para o login
  protected badgeErrorNumber = signal<boolean>(false); // armazena valor boleano se contem ou não numeros
  protected badgeEmptyFieldError = signal<boolean>(false); // armazena valor boleano se esta vazio
  protected passwordEmptyFieldError = signal<boolean>(false); // armazena valor boleano se esta vazio
  protected showPassword = signal<boolean>(false); // armazena valor boleano para vizualização da senha
  // Validação geral somente ao enviar o post do login
  protected isFormValid = computed(() => {
    const model = this.loginModel();
    const badgeOk = model.badge.length > 0 && !this.badgeErrorNumber();
    const passwordOk = model.password.length > 0 && !this.passwordEmptyFieldError();
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
