import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { PerfilData } from '../../interfaces/perfil-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { PerfilService } from '../../services/perfil.service';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';

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
  private auditoriaService = inject(AuditoriaService);

  protected readonly listar = this.perfilService.perfil;
  protected readonly buscar = signal<PerfilData | null>(null);
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData | null>(null);

  protected operacaoEstado = signal<string>('inicial');
  protected registroEstado = signal<string>('informacao');
  protected auditoriaEstado = signal<boolean>(true);

  protected perfilModel = signal<PerfilData>({ descricao: '' });

  protected formSubmitted = signal<boolean>(false);
  protected descricaoTouched = signal<boolean>(false);
  protected isDescricaoEmpty = computed(() => {
    return this.perfilModel().descricao.trim().length === 0;
  });
  protected isDescricaoEquals = computed(() => {
    const des = this.perfilModel().descricao.toUpperCase();
    const atualizaIgual = des === this.buscar()?.descricao;
    const registroIgual = this.listar().some((item) => item.descricao === des);
    return atualizaIgual || registroIgual;
  });

  protected descricaoEmptyFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEmpty();
  });

  protected descricaoEqualsFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEquals();
  });

  protected isFormValid = computed(() => {
    const descricaoOk = !this.descricaoEmptyFiedlsError() && !this.descricaoEqualsFiedlsError();
    return descricaoOk;
  });

  protected onBlur(field: 'descricao'): void {
    if (field === 'descricao') this.descricaoTouched.set(true);
  }

  protected onInput(field: keyof PerfilData, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  ngOnInit(): void {
    this.carregar().subscribe();
  }

  protected carregar() {
    return this.perfilService.listar();
  }

  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

  protected mudarOperacao(operacao: Operacao, item?: string): void {
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
    if (registro === 'atualizar') {
      this.resetForm();
      this.perfilModel.set({ descricao: this.buscar()!.descricao });
    }
    this.auditoriaEstado.set(true);
    this.registroEstado.set(registro);
  }

  protected mudarAuditoria(dados?: AuditoriaData): void {
    if (this.auditoriaEstado() && dados) {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(dados);
    } else {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(null);
    }
  }

  private carregarRegistro(id: string): void {
    this.carregar().subscribe({
      next: () => {
        const dado = this.listar().find((item) => item.id === id);
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
          this.buscar.set(dado);
          this.perfilModel.set({ descricao: dado.descricao });
        }
      },
    });
  }

  protected cadastrar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }
    this.perfilService
      .cadastrar(this.perfilModel())
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.carregar();
          this.resetForm();
          this.mudarOperacao('inicial');
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar perfil:', err);
          alert('Falha ao cadastrar perfil. Tente novamente.');
        },
      });
  }

  protected atualizar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }
    this.perfilService
      .atualizar(this.buscar()!.id!, this.perfilModel())
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.resetForm();
          this.mudarOperacao('registro', this.buscar()!.id!);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar perfil:', err);
          alert('Falha ao atualizar perfil. Tente novamente.');
        },
      });
  }

  protected inativar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.buscar()?.status) {
      alert('Perfil já está inativo!');
      return;
    }
    this.perfilService
      .inativar(this.buscar()!.id!)
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.carregar();
          this.carregarRegistro(this.buscar()!.id!);
          this.mudarOperacao('registro', this.buscar()!.id!);
        },
        error: (err: any) => {
          console.error('Erro ao inativar o perfil:', err);
          alert('Falha ao inativar perfil. Tente novamente.');
        },
      });
  }

  protected eliminar(event: Event) {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.buscar()?.status) {
      alert('Perfil não está inativo!');
      return;
    }
    this.perfilService
      .deletar(this.buscar()!.id!)
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.carregar();
          this.mudarOperacao('inicial');
        },
        error: (err: any) => {
          console.error('Erro ao eliminar o perfil:', err);
          alert('Falha ao eliminar o perfil. Tente novamente.');
        },
      });
  }

  private resetForm(): void {
    this.perfilModel.set({ descricao: '' });
    this.descricaoTouched.set(false);
    this.formSubmitted.set(false);
  }
}
