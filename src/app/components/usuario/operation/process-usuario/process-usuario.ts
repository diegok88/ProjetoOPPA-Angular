import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DataProcessUsuario } from '../../../../constants/data-process.const';
import {
  RecordType,
  OperationType,
  RecordMap,
  OperationMap,
} from '../../../../constants/operation-map.const';
import {
  CONFIRMAR_ATIVAR,
  CONFIRMAR_INATIVAR,
  CONFIRMAR_ELIMINAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_ERRO_ACT,
  FINALIZAR_SUCESSO,
  FINALIZAR_ERRO,
  FINALIZAR_CANCELAR,
} from '../../../../entities/dialogo-finalizar.model';
import { ConfigProcess } from '../../../../interfaces/config-process.interface';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { INICIALIZAR_USUARIO_ENTITY, UsuarioModel } from '../../../../entities/usuario.model';
import { GestorService } from '../../../../services/gestor.service';

@Component({
  selector: 'app-process-usuario',
  imports: [FormsModule, MatButtonModule],
  templateUrl: './process-usuario.html',
  styles: ``,
})
export class ProcessUsuario implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private usuarioService = inject(UsuarioService);
  private gestorService = inject(GestorService);

  /* SIGNAL DE CONFIGURAÇÃO DO TIPO DE PROCESSO */
  protected listaProcessoSignal = signal<ConfigProcess | null>(null);

  /* SIGNAL VALIDAÇÃO DO TIPO DE PROCESSO */
  private tipoProcesso = signal<RecordType | null>(null);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscar = input<UsuarioModel>(INICIALIZAR_USUARIO_ENTITY());
  public onMudarOperacao = output<OperationType>();

  /* INICIALIZAR O PROCESSO */
  ngOnInit(): void {
    if (this.buscar()?.status && this.registroAtual() === RecordMap.STATUS) {
      this.carregarRegistro(RecordMap.INATIVAR);
      this.tipoProcesso.set(RecordMap.INATIVAR);
    } else if (!this.buscar()?.status && this.registroAtual() === RecordMap.STATUS) {
      this.carregarRegistro(RecordMap.ATIVAR);
      this.tipoProcesso.set(RecordMap.ATIVAR);
    } else {
      this.carregarRegistro(this.registroAtual()!);
      this.tipoProcesso.set(RecordMap.ELIMINAR);
    }
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.gestorService.listarTabela();
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONATDOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.usuarioService.counter();
  }

  /* FUNÇÃO DE INATIVAR, ATIVAR E ELIMINAR */
  protected executar(event: Event): void {
    event.preventDefault();

    const processo = this.tipoProcesso() === RecordMap.ELIMINAR;
    const ativado = this.buscar().status === true;

    if (processo && ativado) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ACT,
        operacao: 'Eliminação do usuário',
        dados: this.buscar().nome.toLocaleUpperCase(),
      });
      return;
    }

    const id = this.buscar()!.id;

    if (this.tipoProcesso() === RecordMap.ATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATIVAR,
          entidade: 'usuário',
          dados: this.buscar()?.nome.toUpperCase(),
          acao: () => this.usuarioService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Ativação do usuário',
              dados: this.buscar()!.nome,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Ativação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Ativação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_INATIVAR,
          entidade: 'usuário',
          dados: this.buscar()?.nome.toUpperCase(),
          acao: () => this.usuarioService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Inativação do usuário',
              dados: this.buscar()!.nome,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Inativação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Inativação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ELIMINAR,
          entidade: 'usuário',
          dados: this.buscar()!.nome.toUpperCase(),
          acao: () => this.usuarioService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Eliminação do usuário',
              dados: this.buscar()!.nome,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Eliminação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Eliminação do usuário',
              dados: this.buscar()!.nome.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE CARREGAR A TELA DE INATIVAR, ATIVAR E ELIMINAR */
  protected carregarRegistro(registro: RecordType): void {
    const carregar = DataProcessUsuario.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
