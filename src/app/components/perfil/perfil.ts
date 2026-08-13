import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';
import { PerfilData } from '../../interfaces/perfil-data.interface';

type Operacao = 'inicial' | 'cadastrar' | 'registro';
type Registro = 'informacao' | 'atualizar' | 'inativar' | 'eliminar' | 'auditoria';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);
  protected readonly listar = this.perfilService.perfil;
  protected readonly buscar = signal<PerfilData | null>(null);

  protected operacaoEstado = signal<string>('inicial');
  protected registroEstado = signal<string>('informacao');

  ngOnInit(): void {
    this.perfilService.listar();
  }

  protected recarregar(): void {
    this.perfilService.listar();
  }

  protected mudarOperacao(operacao: Operacao, item?: PerfilData): void {
    if (operacao === 'registro') {
      this.registroEstado.set('informacao');
      if (item) this.carregarRegistro(item);
    }
    this.operacaoEstado.set(operacao);
  }

  private carregarRegistro(item: PerfilData): void {
    this.buscar.set(item);
  }

  protected mudarRegistro(registro: Registro): void {
    this.registroEstado.set(registro);
  }
}
