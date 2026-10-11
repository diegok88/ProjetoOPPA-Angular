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
import { TagAtivosModel, INICIALIZAR_TAGATIVOS_ENTITY } from '../../../../entities/tag-ativo.model';
import { TagAtivosService } from '../../../../services/tag-ativo.service';
import { DataProcessTagAtivo } from '../../../../constants/data-process.const';

@Component({
  selector: 'app-process-tag-ativos',
  imports: [Bloqueado, FormsModule, MatButtonModule],
  templateUrl: './process-tag-ativos.html',
  styles: ``,
})
export class ProcessTagAtivos implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private tagAtivosService = inject(TagAtivosService);
  private authService = inject(AuthService);

  /* SIGNAL DE CONFIGURAÇÃO DO TIPO DE PROCESSO */
  protected listaProcessoSignal = signal<ConfigProcess | null>(null);

  /* SIGNAL VALIDAÇÃO DO TIPO DE PROCESSO */
  private tipoProcesso = signal<RecordType | null>(null);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public authorization = input<boolean | undefined>();
  public operacaoAtual = input<OperationType | undefined>();
  public registroAtual = input<RecordType | undefined>();
  public buscar = input<TagAtivosModel>(INICIALIZAR_TAGATIVOS_ENTITY());
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
    return this.tagAtivosService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO DO CONTADOR A CADA SERVIÇO CONCLUIDO */
  protected carregarContador() {
    return this.tagAtivosService.counter();
  }

  /* FUNÇÃO DE INATIVAR, ATIVAR E ELIMINAR */
  protected executar(event: Event): void {
    event.preventDefault();

    const processo = this.tipoProcesso() === RecordMap.ELIMINAR;
    const ativado = this.buscar().status === true;

    if (processo && ativado) {
      this.finalizarService.finalizar({
        ...FINALIZAR_ERRO_ACT,
        operacao: 'Eliminação da tag',
        dados: this.buscar().descricao.toLocaleUpperCase(),
      });
      return;
    }

    const id = this.buscar()!.id;

    if (this.tipoProcesso() === RecordMap.ATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATIVAR,
          entidade: 'tag de ativo',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.tagAtivosService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Ativação da tag',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Ativação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Ativação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_INATIVAR,
          entidade: 'tag de ativo',
          dados: this.buscar()?.descricao.toUpperCase(),
          acao: () => this.tagAtivosService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Inativação da tag',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Inativação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Inativação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ELIMINAR,
          entidade: 'tag de ativo',
          dados: this.buscar()!.descricao.toUpperCase(),
          acao: () => this.tagAtivosService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.carregarContador().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Eliminação da tag',
              dados: this.buscar()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Eliminação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Eliminação da tag',
              dados: this.buscar()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE CARREGAR A TELA DE INATIVAR, ATIVAR E ELIMINAR */
  protected carregarRegistro(registro: RecordType): void {
    const carregar = DataProcessTagAtivo.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
