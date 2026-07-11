import { Component, signal } from '@angular/core';
import { LoginData } from '../../../interfaces/login-data.interface';

@Component({
  selector: 'app-login-user',
  imports: [],
  templateUrl: './login-user.html',
  styleUrl: './login-user.scss',
})
export class LoginUser {
  // Objeto armazena dados para o login
  protected loginModel = signal<LoginData>({
    badge: '',
    password: '',
  });
  // Variavel de erro
  protected badgeError = signal<boolean>(false);

  // Função para verificar apenas numeros
  protected onBadgeInput(value: string) {
    // Remove tudo que não é número
    const numberOnly = value.replace(/\D/g, '');
    // Verifica se houve alteração
    this.badgeError.set(value !== numberOnly);
    // Atualiza o objeto
    this.loginModel.update((model) => ({
      ...model,
      badge: numberOnly,
    }));
  }
}
