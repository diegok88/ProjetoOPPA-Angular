import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { UsuarioData } from '../../interfaces/usuario-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { DialogConfirmarService } from '../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../services/dialog-finalizar.service';
import { PerfilService } from '../../services/perfil.service';
import { UsuarioService } from '../../services/usuario.service';

import { Instance } from 'flatpickr/dist/types/instance';
import { FlatpickrDirective } from '../../directives/flatpickr.directive';

type Operacao = 'inicial' | 'cadastrar' | 'registro';
type Registro = 'informacao' | 'atualizar' | 'inativar' | 'eliminar' | 'auditoria';
type Field =
  'nome' | 'dataNascimento' | 'dataAdmissao' | 'perfilId' | 'escala' | 'turno' | 'empresaId';
type Escala = 'A' | 'B' | 'C' | 'D';
type Turno = 'MANHA' | 'TARDE' | 'NOITE' | 'COMERCIAL';

const ESCALAS = ['A', 'B', 'C', 'D'] as const;
const TURNOS = ['MANHA', 'TARDE', 'NOITE', 'COMERCIAL'] as const;

@Component({
  selector: 'app-usuario',
  imports: [FormsModule, FlatpickrDirective],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Usuario {
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  private usuarioService = inject(UsuarioService);
  private perfilService = inject(PerfilService);
  private auditoriaService = inject(AuditoriaService);

  protected readonly listar = this.usuarioService.usuario;
  protected readonly buscar = signal<UsuarioData | null>(null);
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData | null>(null);

  protected escalas = ESCALAS;

  protected operacaoEstado = signal<string>('inicial');
  protected registroEstado = signal<string>('informacao');
  protected auditoriaEstado = signal<boolean>(true);

  protected usuarioModel = signal<UsuarioData>({
    nome: '',
    dataNascimento: null,
    dataAdmissao: new Date(),
    perfilId: '',
    turno: '' as Turno,
    escala: '' as Escala,
    empresaId: '',
  });

  /*Configuração do calendário*/
  flatpickrConfig = {
    onReady: (selectedDates: Date[], dateStr: string, instance: Instance) => {
      let footer = instance.calendarContainer.querySelector('.flatpickr-footer');
      if (!footer) {
        footer = document.createElement('div');
        footer.className = 'flatpickr-footer';
        instance.calendarContainer.appendChild(footer);
      }

      // 2. Limpa e adiciona os botões
      footer.innerHTML = '';

      const hojeBtn = document.createElement('button');
      hojeBtn.textContent = 'Hoje';
      hojeBtn.className = 'flatpickr-btn';
      hojeBtn.onclick = () => instance.setDate(new Date());

      const limparBtn = document.createElement('button');
      limparBtn.textContent = 'Limpar';
      limparBtn.className = 'flatpickr-btn';
      limparBtn.onclick = () => instance.clear();

      footer.appendChild(hojeBtn);
      footer.appendChild(limparBtn);
    },
  };

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(true);
  //-------------------------------------------------------------------------------------//
  protected nomeTouched = signal<boolean>(false);

  protected isNomeEquals = computed(() => {
    const des = this.usuarioModel().nome.toUpperCase();
    const atualizaIgual = des === this.buscar()?.nome;
    return atualizaIgual;
  });

  protected nomeEqualsFiedlsError = computed(() => {
    return (this.nomeTouched() || this.formSubmitted()) && this.isNomeEquals();
  });

  protected isNomeEmpty = computed(() => {
    return this.usuarioModel().nome.trim().length === 0;
  });

  protected nomeEmptyFiedlsError = computed(() => {
    return (this.nomeTouched() || this.formSubmitted()) && this.isNomeEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected dataNascimentoTouched = signal<boolean>(false);

  protected isDataNascimentoEquals = computed(() => {
    const atual = this.usuarioModel().dataNascimento;
    const buscar = this.buscar()?.dataNascimento;
    if (atual === buscar) return true;
    if (!atual || !buscar) return false;
    return atual.getTime() === buscar.getTime();
  });

  protected dataNascimentoEqualsFiedlsError = computed(() => {
    return (this.dataNascimentoTouched() || this.formSubmitted()) && this.isDataNascimentoEquals();
  });

  protected isDataNascimentoEmpty = computed(() => {
    return (
      this.usuarioModel().dataNascimento === null ||
      this.usuarioModel().dataNascimento === undefined
    );
  });

  protected dataNascimentoEmptyFiedlsError = computed(() => {
    return (this.dataNascimentoTouched() || this.formSubmitted()) && this.isDataNascimentoEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected dataAdmissaoTouched = signal<boolean>(false);

  protected isDataAdmissaooEquals = computed(() => {
    const atual = this.usuarioModel().dataAdmissao;
    const buscar = this.buscar()?.dataAdmissao;
    if (atual === buscar) return true;
    if (!atual || !buscar) return false;
    return atual.getTime() === buscar.getTime();
  });

  protected dataAdmissaoEqualsFiedlsError = computed(() => {
    return (this.dataAdmissaoTouched() || this.formSubmitted()) && this.isDataAdmissaooEquals();
  });

  protected isDataAdmissaoEmpty = computed(() => {
    return (
      this.usuarioModel().dataAdmissao === null || this.usuarioModel().dataAdmissao === undefined
    );
  });

  protected dataAdmissaoEmptyFiedlsError = computed(() => {
    return (this.dataAdmissaoTouched() || this.formSubmitted()) && this.isDataAdmissaoEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected perfilIdTouched = signal<boolean>(false);

  protected isPerfilIdEquals = computed(() => {
    const des = this.usuarioModel().perfilId;
    const atualizaIgual = des === this.buscar()?.perfilId;
    return atualizaIgual;
  });

  protected perfilIdEqualsFiedlsError = computed(() => {
    return (this.perfilIdTouched() || this.formSubmitted()) && this.isNomeEquals();
  });

  protected isPerfilIdEmpty = computed(() => {
    return this.usuarioModel().perfilId?.trim().length === 0;
  });

  protected perfilIdEmptyFiedlsError = computed(() => {
    return (this.perfilIdTouched() || this.formSubmitted()) && this.isPerfilIdEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected escalaTouched = signal<boolean>(false);

  protected isEscalaEquals = computed(() => {
    const des = this.usuarioModel().escala;
    const atualizaIgual = des === this.buscar()?.escala;
    return atualizaIgual;
  });

  protected escalaEqualsFiedlsError = computed(() => {
    return (this.escalaTouched() || this.formSubmitted()) && this.isEscalaEquals();
  });

  protected isEscalaEmpty = computed(() => {
    return this.usuarioModel().escala.trim().length === 0;
  });

  protected escalaEmptyFiedlsError = computed(() => {
    return (this.escalaTouched() || this.formSubmitted()) && this.isEscalaEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected turnoTouched = signal<boolean>(false);

  protected isTurnoEquals = computed(() => {
    const des = this.usuarioModel().turno;
    const atualizaIgual = des === this.buscar()?.turno;
    return atualizaIgual;
  });

  protected turnoEqualsFiedlsError = computed(() => {
    return (this.turnoTouched() || this.formSubmitted()) && this.isTurnoEquals();
  });

  protected isTurnoEmpty = computed(() => {
    return this.usuarioModel().turno.trim().length === 0;
  });

  protected turnoEmptyFiedlsError = computed(() => {
    return (this.turnoTouched() || this.formSubmitted()) && this.isTurnoEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected empresaIdTouched = signal<boolean>(false);

  protected isEmpresaIdEquals = computed(() => {
    const des = this.usuarioModel().empresaId;
    const atualizaIgual = des === this.buscar()?.empresaId;
    return atualizaIgual;
  });

  protected empresaIdEqualsFiedlsError = computed(() => {
    return (this.empresaIdTouched() || this.formSubmitted()) && this.isEmpresaIdEquals();
  });

  protected isEmpresaIdEmpty = computed(() => {
    return this.usuarioModel().empresaId?.trim().length === 0;
  });

  protected empresaIdEmptyFiedlsError = computed(() => {
    return (this.empresaIdTouched() || this.formSubmitted()) && this.isEmpresaIdEmpty();
  });
  //-------------------------------------------------------------------------------------//
  protected isFormValid = computed(() => {
    const nomeOk = this.nomeEmptyFiedlsError() || this.nomeEqualsFiedlsError();
    const dataNascimentoOk =
      this.dataNascimentoEqualsFiedlsError() || this.dataNascimentoEmptyFiedlsError();
    const dataAdmissaoOk =
      this.dataAdmissaoEqualsFiedlsError() || this.dataAdmissaoEmptyFiedlsError();
    const perfilIdOk = this.perfilIdEqualsFiedlsError() || this.perfilIdEmptyFiedlsError();
    const escalaOk = this.escalaEqualsFiedlsError() || this.escalaEmptyFiedlsError();
    const turnoOk = this.turnoEqualsFiedlsError() || this.turnoEmptyFiedlsError();
    const empresaOk = this.empresaIdEqualsFiedlsError() || this.empresaIdEmptyFiedlsError();
    const touchedOk = this.touchedSubmitted();
    console.log(dataNascimentoOk);
    const dadosOk =
      nomeOk ||
      dataNascimentoOk ||
      dataAdmissaoOk ||
      perfilIdOk ||
      escalaOk ||
      turnoOk ||
      empresaOk ||
      touchedOk;
    console.log(dadosOk);
    return dadosOk;
  });

  protected onBlur(field: Field): void {
    if (field) this.touchedSubmitted.set(false);
    if (field === 'nome') this.nomeTouched.set(true);
    if (field === 'dataNascimento') this.dataNascimentoTouched.set(true);
    if (field === 'dataAdmissao') this.dataAdmissaoTouched.set(true);
    if (field === 'perfilId') this.perfilIdTouched.set(true);
    if (field === 'escala') this.escalaTouched.set(true);
    if (field === 'turno') this.turnoTouched.set(true);
    if (field === 'empresaId') this.empresaIdTouched.set(true);
  }
  /*
  getter e setter adaptados ao tipo DATE.
  */
  protected getField(field: keyof UsuarioData) {
    const value = this.usuarioModel()[field];
    if (field === 'dataAdmissao' || field === 'dataNascimento') {
      if (value instanceof Date) {
        const ano = value.getFullYear();
        const mes = String(value.getMonth() + 1).padStart(2, '0');
        const dia = String(value.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
      }
      if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = value.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return null;
    }
    return value ?? '';
  }

  protected setField(field: keyof UsuarioData, value: string | Date | null): void {
    this.usuarioModel.update((model: UsuarioData) => {
      const atualizar: Partial<UsuarioData> = {};
      switch (field) {
        case 'dataAdmissao':
        case 'dataNascimento': {
          let dateValue: Date | null = null;
          if (value instanceof Date) {
            dateValue = value;
          } else if (typeof value === 'string') {
            if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
              const parts = value.split('T')[0].split('-');
              dateValue = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
              const parts = value.split('/');
              dateValue = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            }
          }
          atualizar[field] = dateValue;
          break;
        }
        case 'nome':
        case 'perfilId':
        case 'empresaId':
          atualizar[field] = value as string;
          break;
      }
      return { ...model, ...atualizar };
    });
  }

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
  }

  ngOnInit(): void {
    this.carregar().subscribe();
  }

  protected carregar() {
    return this.usuarioService.listarAssist();
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
      this.usuarioModel.set({
        nome: this.buscar()!.nome,
        dataNascimento: this.buscar()!.dataNascimento,
        dataAdmissao: this.buscar()!.dataAdmissao,
        perfilId: this.buscar()!.perfilId,
        escala: this.buscar()!.escala,
        turno: this.buscar()!.turno,
        empresaId: this.buscar()!.empresaId,
      });
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
          this.usuarioModel.set({
            nome: this.buscar()!.nome,
            dataNascimento: this.buscar()!.dataNascimento,
            dataAdmissao: this.buscar()!.dataAdmissao,
            perfilId: this.buscar()!.perfilId,
            escala: this.buscar()!.escala,
            turno: this.buscar()!.turno,
            empresaId: this.buscar()!.empresaId,
          });
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

    const usuario = this.usuarioModel();

    this.confirmarService
      .confirmar({
        icone: '/icons/add_circle_84.png',
        titulo: 'Novo Perfil',
        mensagem: `Deseja confirmar o cadastro do usuário ${usuario.nome.toUpperCase()}?`,
        acao: () => this.usuarioService.cadastrarAssist(usuario),
      })
      .subscribe((confirmado) => {
        console.log(confirmado);
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.mudarOperacao('inicial');
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Sucesso!',
            mensagem: 'Cadastrado com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no cadastro.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
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

    const usuario = this.usuarioModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/change_circle_84.png',
        titulo: 'Atualizar Perfil',
        mensagem: `Deseja confirmar a atualização da usuário ${usuario.nome.toUpperCase()}?`,
        acao: () => this.usuarioService.atualizar(id!, usuario),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.mudarOperacao('registro', id!);
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: usuario.nome,
            titulo: 'Sucesso!',
            mensagem: 'Atualizado com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no atualização.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
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

    const usuario = this.usuarioModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/block_84.png',
        titulo: 'Inativar Perfil',
        mensagem: `Deseja confirmar a inativação da usuário ${usuario.nome.toUpperCase()}?`,
        acao: () => this.perfilService.inativar(id!),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.mudarOperacao('registro', id!);
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: usuario.nome,
            titulo: 'Sucesso!',
            mensagem: 'Inativação com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no inativação.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
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

    const usuario = this.usuarioModel();
    const id = this.buscar()?.id;

    this.confirmarService
      .confirmar({
        icone: '/icons/delete_84.png',
        titulo: 'Eliminar Perfil',
        mensagem: `Deseja confirmar a eliminação da usuário ${usuario.nome.toUpperCase()}?`,
        acao: () => this.perfilService.deletar(id!),
      })
      .subscribe((confirmado) => {
        if (confirmado === 'finalizado') {
          this.mudarOperacao('inicial');
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: usuario.nome,
            titulo: 'Sucesso!',
            mensagem: 'Eliminação com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha na eliminação.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: usuario.nome.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de eliminação cancelada.',
          });
        }
      });
  }

  private resetForm(): void {
    this.usuarioModel.set({
      nome: '',
      dataNascimento: null,
      dataAdmissao: null,
      perfilId: '',
      turno: '' as Turno,
      escala: '' as Escala,
      empresaId: '',
    });
    this.nomeTouched.set(false);
    this.dataNascimentoTouched.set(false);
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
