import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilData } from '../../interfaces/perfil-data.interface';
import { PerfilService } from '../../services/perfil.service';

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

  protected perfilModel = signal<PerfilData>({ descricao: '' });

  protected formSubmitted = signal<boolean>(false);
  protected descricaoTouched = signal<boolean>(false);
  protected isDescricaoEmpty = computed(() => {
    this.perfilModel().descricao.trim().length === 0;
  });

  protected descricaoEmptyFielsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEmpty();
  });

  protected isFormValid = computed(() => {
    const descricaoOk = !this.descricaoEmptyFielsError();
    return descricaoOk;
  });

  protected onBlur(field: 'descricao'): void {
    if (field === 'descricao') this.descricaoTouched.set(true);
  }

  protected onInput(field: keyof PerfilData, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  ngOnInit(): void {
    this.perfilService.listar();
  }

  protected recarregar(): void {
    this.perfilService.listar();
  }

  protected mudarOperacao(operacao: Operacao, item?: PerfilData): void {
    if (operacao === 'registro') {
      this.registroEstado.set('informacao');
      this.resetForm();
      if (item) this.carregarRegistro(item);
    }
    if (operacao === 'cadastrar') {
      this.resetForm();
    }
    this.operacaoEstado.set(operacao);
  }

  protected mudarRegistro(registro: Registro): void {
    this.registroEstado.set(registro);
  }

  private carregarRegistro(item: PerfilData): void {
    this.buscar.set(item);
  }

  protected cadastrar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      console.warn('Formulário inválido - não enviar');
      return;
    }
    this.perfilService.cadastrar(this.perfilModel()).subscribe({
      next: () => {
        this.perfilService.listar();
        this.resetForm();
        this.mudarOperacao('inicial');
      },
      error: (err: any) => {
        console.error('Erro ao obter perfil:', err);
        alert('Falha ao carregar perfil. Tente novamente.');
      },
    });
  }

  protected atualizar() {}

  private resetForm(): void {
    this.perfilModel.set({ descricao: '' });
    this.descricaoTouched.set(false);
    this.formSubmitted.set(false);
  }
}
