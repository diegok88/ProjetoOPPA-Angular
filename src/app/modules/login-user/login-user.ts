import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from '../../interfaces/login-data.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-user',
  imports: [FormsModule],
  templateUrl: './login-user.html',
  styleUrl: './login-user.scss',
})
export class LoginUser {
  private router = inject(Router);
  private auth = inject(AuthService);
  // Objeto armazena dados para o login
  protected loginModel = signal<LoginData>({ badge: '', password: '', enterprice: '' });
  // Armazena valor boleano para visualização da senha
  protected showPassword = signal<boolean>(false);
  // Estados de controle de toque/interação do usuário
  protected bagdeTouched = signal<boolean>(false);
  protected passwordTouched = signal<boolean>(false);
  protected enterpriceTouched = signal<boolean>(false);
  protected formSubmitted = signal<boolean>(false);
  // Funções de validações privada: executa sempre que haver mudança nos campos
  private isBadgeEmpty = computed(() => this.loginModel().badge.trim().length === 0);
  private isBadgeNotNumber = computed(() => {
    const value = this.loginModel().badge;
    const onlyNumbers = /^\d+$/.test(value);
    return !onlyNumbers && value.length > 0;
  });
  private isPasswordEmpty = computed(() => this.loginModel().password.trim().length === 0);
  private isEnterpriceEmpty = computed(() => this.loginModel().enterprice.trim().length === 0);
  private isEnterpriceNotNumber = computed(() => {
    const value = this.loginModel().enterprice;
    const onlyNumbers = /^\d+$/.test(value);
    return !onlyNumbers && value.length > 0;
  });
  // Erros visiveis na tela
  protected badgeErrorNumber = computed(() => {
    return (this.bagdeTouched() || this.formSubmitted()) && this.isBadgeNotNumber();
  });
  protected badgeEmptyFieldError = computed(() => {
    return (this.bagdeTouched() || this.formSubmitted()) && this.isBadgeEmpty();
  });
  protected passwordEmptyFieldError = computed(() => {
    return (this.passwordTouched() || this.formSubmitted()) && this.isPasswordEmpty();
  });
  protected enterpriceErrorNumber = computed(() => {
    return (this.enterpriceTouched() || this.formSubmitted()) && this.isEnterpriceNotNumber();
  });
  protected enterpriceEmptyFieldError = computed(() => {
    return (this.enterpriceTouched() || this.formSubmitted()) && this.isEnterpriceEmpty();
  });
  // Validação geral somente ao enviar o post do login
  protected isFormValid = computed(() => {
    const badgeOk = !this.badgeEmptyFieldError() && !this.badgeErrorNumber();
    const passwordOk = !this.passwordEmptyFieldError();
    const enterpriceOk = !this.enterpriceEmptyFieldError() && !this.enterpriceEmptyFieldError();
    return badgeOk && passwordOk && enterpriceOk;
  });
  // Função generica de atualização todos os inputs
  protected onInput(field: keyof LoginData, value: string): void {
    this.loginModel.update((model) => ({ ...model, [field]: value }));
  }
  // Marca o campo como tocado ao perder o foco (blur)
  protected onBlur(field: 'badge' | 'password' | 'enterprice'): void {
    if (field === 'badge') this.bagdeTouched.set(true);
    if (field === 'password') this.passwordTouched.set(true);
    if (field === 'enterprice') this.enterpriceTouched.set(true);
  }
  // Função de visualização da senha
  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
  // Função de confirmação do login
  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      console.warn('Formulário inválido - não enviar');
      return;
    }
    this.auth.login(this.loginModel()).subscribe({
      next: () => {
        this.auth.obterPerfil().subscribe({
          next: (usuario) => {
            this.router.navigate(['']);
          },
        });
      },
      error: (err) => {
        console.error(err);
        alert('Falha no login. Verifique suas credenciais!');
      },
    });
    console.log('Login com: ', this.loginModel());
  }
}
