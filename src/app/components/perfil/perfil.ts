import { Component, inject, OnInit, signal } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { FormsModule } from '@angular/forms';

type Operacao = 'inicial' | 'cadastrar';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);
  protected readonly listar = this.perfilService.perfil;

  protected operacaoEstado = signal<string>('inicial');

  ngOnInit(): void {
    this.perfilService.listar();
  }

  protected recarregar(): void {
    this.perfilService.listar();
  }

  protected mudarOperacao(operacao: Operacao): void {
    this.operacaoEstado.set(operacao);
  }
}
