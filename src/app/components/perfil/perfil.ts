import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilData } from '../../interfaces/perfil-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { PerfilService } from '../../services/perfil.service';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { DialogConfirmarService } from '../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../services/dialog-finalizar.service';

type Operacao = 'inicial' | 'cadastrar' | 'registro';
type Registro = 'informacao' | 'atualizar' | 'inativar' | 'eliminar' | 'auditoria';
type Field = 'descricao';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
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

  protected touchedSubmitted = signal<boolean>(true);
  //-------------------------------------------------------------------------------------//
  protected descricaoTouched = signal<boolean>(false);

  protected isDescricaoEquals = computed(() => {
    const des = this.perfilModel().descricao.toUpperCase();
    const atualizaIgual = des === this.buscar()?.descricao;
    const registroIgual = this.listar().some((item) => item.descricao === des);
    return atualizaIgual || registroIgual;
  });

  protected descricaoEqualsFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEquals();
  });

  protected isDescricaoEmpty = computed(() => {
    return this.perfilModel().descricao.trim().length === 0;
  });

  protected descricaoEmptyFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected isFormValid = computed(() => {
    const descricaoOk = this.descricaoEmptyFiedlsError() && this.descricaoEqualsFiedlsError();
    const touchedOk = this.touchedSubmitted();
    const dadosOk = descricaoOk || touchedOk;
    return dadosOk;
  });

  protected onBlur(field: Field): void {
    if (field) this.touchedSubmitted.set(false);
    if (field === 'descricao') this.descricaoTouched.set(true);
  }

  protected getField(field: keyof PerfilData) {
    return this.perfilModel()[field] ?? '';
  }

  protected setField(field: keyof PerfilData, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
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
    if (this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }

    const perfil = this.perfilModel();

    this.confirmarService
      .confirmar({
        icone: '/icons/add_circle_84.png',
        titulo: 'Novo Perfil',
        mensagem: `Deseja confirmar o cadastro do perfil ${perfil.descricao.toUpperCase()}?`,
        acao: () => this.perfilService.cadastrar(perfil),
      })
      .subscribe((confirmado) => {
        console.log(confirmado);
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.mudarOperacao('inicial');
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Sucesso!',
            mensagem: 'Cadastrado com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no cadastro.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de cadastro cancelada.',
          });
        }
      });
  }

  protected atualizar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }

    const perfil = this.perfilModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/change_circle_84.png',
        titulo: 'Atualizar Perfil',
        mensagem: `Deseja confirmar a atualização da perfil ${perfil.descricao.toUpperCase()}?`,
        acao: () => this.perfilService.atualizar(id!, perfil),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.mudarOperacao('registro', id!);
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: perfil.descricao,
            titulo: 'Sucesso!',
            mensagem: 'Atualizado com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no atualização.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de atualização cancelada.',
          });
        }
      });
  }

  protected inativar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.buscar()?.status) {
      alert('Perfil já está inativo!');
      return;
    }

    const perfil = this.perfilModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/block_84.png',
        titulo: 'Inativar Perfil',
        mensagem: `Deseja confirmar a inativação da perfil ${perfil.descricao.toUpperCase()}?`,
        acao: () => this.perfilService.inativar(id!),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.mudarOperacao('registro', id!);
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: perfil.descricao,
            titulo: 'Sucesso!',
            mensagem: 'Inativação com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no inativação.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de inativação cancelada.',
          });
        }
      });
  }

  protected eliminar(event: Event) {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.buscar()?.status) {
      alert('Perfil não está inativo!');
      return;
    }

    const perfil = this.perfilModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/delete_84.png',
        titulo: 'Eliminar Perfil',
        mensagem: `Deseja confirmar a eliminação da perfil ${perfil.descricao.toUpperCase()}?`,
        acao: () => this.perfilService.deletar(id!),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.mudarOperacao('inicial');
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: perfil.descricao,
            titulo: 'Sucesso!',
            mensagem: 'Eliminação com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha na eliminação.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de eliminação cancelada.',
          });
        }
      });
  }

  private resetForm(): void {
    this.perfilModel.set({ descricao: '' });
    this.descricaoTouched.set(false);
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
