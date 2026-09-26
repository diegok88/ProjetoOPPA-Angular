import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-principal',
  imports: [MatIconModule],
  templateUrl: './principal.html',
  styleUrl: './principal.scss',
})
export class Principal {
  private authService = inject(AuthService);

  protected perfilService = inject(PerfilService);
  protected perfil = this.perfilService.buscarPerfil;

  protected readonly usuario = this.authService.usuario;

  private data = new Date();
  protected mesAtual = this.data.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
}
