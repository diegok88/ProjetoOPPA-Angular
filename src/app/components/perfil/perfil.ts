import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';

type Operacao = 'inicial' | 'cadastrar' | 'registro';
type Registro = 'informacao' | 'atualizar' | 'inativar' | 'eliminar';

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
  protected registroEstado = signal<string>('informacao');

  ngOnInit(): void {
    this.perfilService.listar();
  }

  protected recarregar(): void {
    this.perfilService.listar();
  }

  protected mudarOperacao(operacao: Operacao): void {
    this.operacaoEstado.set(operacao);
  }

  protected mudarRegistro(registro: Registro): void {
    this.registroEstado.set(registro);
  }
}
