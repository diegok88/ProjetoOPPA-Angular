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

import { SolucoesService } from '../../../../services/solucoes.service';
import { SolucoesModel, INICIALIZAR_SOLUCOES_ENTITY } from '../../../../entities/solucoes.model';
import { DataProcessSolucoes } from '../../../../constants/data-process.const';

@Component({
  selector: 'app-process-solucoes',
  imports: [Bloqueado, FormsModule, MatButtonModule],
  templateUrl: './process-solucoes.html',
  styles: ``,
})
export class ProcessSolucoes implements OnInit {
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  private solucoesService = inject(SolucoesService);
  private authService = inject(AuthService);

  protected listaProcessoSignal = signal<ConfigProcess | null>(null);
  private tipoProcesso = signal<RecordType | null>(null);

  public authorization = input<boolean | undefined>();
  public operacaoAtual = input<OperationType | undefined>();
  public registroAtual = input<RecordType | undefined>();
  public buscar = input<SolucoesModel>(INICIALIZAR_SOLUCOES_ENTITY());
  public onMudarOperacao = output<OperationType>();

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

  protected carregar() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.solucoesService.listar(query);
  }

  protected carregarContador() {
    return this.solucoesService.counter();
  }

  protected executar(event: Event): void {
    event.preventDefault();
    const processo = this.tipoProcesso() === RecordMap.ELIMINAR;
    const ativado = this.buscar().status === true;
    if (processo && ativado) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ACT,
        operacao: 'Eliminação da solução',
        dados: this.buscar().descricao.toLocaleUpperCase(),
      });
      return;
    }
    const id = this.buscar()!.id;
    if (this.tipoProcesso() === RecordMap.ATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATIVAR,
          entidade: 'solução',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.solucoesService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Ativação da solução',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Ativação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Ativação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_INATIVAR,
          entidade: 'solução',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.solucoesService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Inativação da solução',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Inativação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Inativação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ELIMINAR,
          entidade: 'solução',
          dados: this.buscar()!.descricao.toUpperCase(),
          acao: () => this.solucoesService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Eliminação da solução',
              dados: this.buscar()!.descricao,
            });
            this.onMudarOperacao.emit(OperationMap.SUB_LISTA);
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Eliminação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Eliminação da solução',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  protected carregarRegistro(registro: RecordType): void {
    const carregar = DataProcessSolucoes.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
