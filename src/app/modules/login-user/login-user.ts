import { Component, signal } from '@angular/core';
import { LoginData } from '../../../interfaces/login-data.interface';

@Component({
  selector: 'app-login-user',
  imports: [],
  templateUrl: './login-user.html',
  styleUrl: './login-user.scss',
})
export class LoginUser {
  protected loginModel = signal<LoginData>({
    badge: '',
    password: '',
  });
}
