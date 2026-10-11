import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { ConfigProcess } from '../../../../interfaces/config-process.interface';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../constants/operation-map.const';
import {
  CONFIRMAR_ATIVAR,
  CONFIRMAR_ELIMINAR,
  CONFIRMAR_INATIVAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_ERRO_ACT,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';
import { Bloqueado } from '../../../bloqueado/bloqueado';
import { AuthService } from '../../../../services/auth.service';

import { FalhasService } from '../../../../services/falhas.service';
import { FalhasModel, INICIALIZAR_FALHAS_ENTITY } from '../../../../entities/falhas.model';
import { DataProcessFalhas } from '../../../../constants/data-process.const';

@Component({
  selector: 'app-process-falhas',
  imports: [Bloqueado, FormsModule, MatButtonModule],
  templateUrl: './process-falhas.html',
  styles: ``,
})
export class ProcessFalhas implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private falhasService = inject(FalhasService);
  private authService = inject(AuthService);
  /* SIGNAL DE CONFIGURAÇÃO DO TIPO DE PROCESSO */
  protected listaProcessoSignal = signal<ConfigProcess | null>(null);
  /* SIGNAL VALIDAÇÃO DO TIPO DE PROCESSO */
  private tipoProcesso = signal<RecordType | null>(null);
  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public authorization = input<boolean | undefined>();
  public operacaoAtual = input<OperationType | undefined>();
  public registroAtual = input<RecordType | undefined>();
  public buscar = input<FalhasModel>(INICIALIZAR_FALHAS_ENTITY());
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
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.falhasService.listar(query);
  }
  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.falhasService.counter();
  }
  /* FUNÇÃO DE INATIVAR, ATIVAR E ELIMINAR */
  protected executar(event: Event): void {
    event.preventDefault();
    const processo = this.tipoProcesso() === RecordMap.ELIMINAR;
    const ativado = this.buscar().status === true;
    if (processo && ativado) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ACT,
        operacao: 'Eliminação da falha',
        dados: this.buscar().descricao.toLocaleUpperCase(),
      });
      return;
    }
    const id = this.buscar()!.id;
    if (this.tipoProcesso() === RecordMap.ATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATIVAR,
          entidade: 'falha',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.falhasService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Ativação da falha',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Ativação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Ativação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_INATIVAR,
          entidade: 'falha',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.falhasService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Inativação da falha',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Inativação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Inativação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ELIMINAR,
          entidade: 'falha',
          dados: this.buscar()!.descricao.toUpperCase(),
          acao: () => this.falhasService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Eliminação da falha',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Eliminação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Eliminação da falha',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }
  /* FUNÇÃO DE CARREGAR A TELA DE INATIVAR, ATIVAR E ELIMINAR */
  protected carregarRegistro(registro: RecordType): void {
    const carregar = DataProcessFalhas.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
