import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-informacoes',
  imports: [MatListModule, DatePipe],
  templateUrl: './informacoes.html',
  styleUrl: './informacoes.scss',
})
export class Informacoes implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  protected readonly info = this.usuarioService.buscarUsuario;

  private isInfo = computed(() => {
    return this.info() === null;
  });

  ngOnInit(): void {
    this.carregarTodos().subscribe();
  }

  protected carregarTodos() {
    const id = this.authService.getPerfil()?.id!;
    return this.usuarioService.buscar(id);
  }
}
