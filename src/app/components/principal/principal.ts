import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-principal',
  imports: [MatIconModule],
  templateUrl: './principal.html',
  styleUrl: './principal.scss',
})
export class Principal {
  private authService = inject(AuthService);

  protected readonly usuario = this.authService.usuario;

  private data = new Date();
  protected mesAtual = this.data.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
}
