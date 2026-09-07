import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { PerfilService } from '../../../../services/perfil.service';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../const/operation-map.const';
import { DataProcessPerfil } from '../../../../const/data-process.const';
import { ConfigProcess } from '../../../../interfaces/config-process.interface';
import { FormsModule } from '@angular/forms';
import { INICIALIZAR_PERFIL_ENTITY, PerfilModel } from '../../../../entities/perfil.model';
import {
  CONFIRMAR_ATIVAR,
  CONFIRMAR_ELIMINAR,
  CONFIRMAR_INATIVAR,
} from '../../../../entities/dialogo-confirmar.model';
import {
  FINALIZAR_CANCELAR,
  FINALIZAR_ERRO,
  FINALIZAR_SUCESSO,
} from '../../../../entities/dialogo-finalizar.model';

@Component({
  selector: 'app-process-perfil',
  imports: [FormsModule, MatButtonModule],
  template: `
    <form (ngSubmit)="executar($event)" class="process-operacao">
      <section class="process-group">
        <img class="image-process" [src]="listaProcessoSignal()?.imagem" alt="Imagem" />
        <span>{{ listaProcessoSignal()?.mensagem }} {{ buscarPerfil().descricao }}?</span>
      </section>
      <button matButton="outlined" type="submit">
        {{ listaProcessoSignal()?.botao }}
      </button>
    </form>
  `,
  styles: ``,
})
export class ProcessPerfil implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private perfilService = inject(PerfilService);

  /* SIGNAL DE CONFIGURAÇÃO DO TIPO DE PROCESSO */
  protected listaProcessoSignal = signal<ConfigProcess | null>(null);

  /* SIGNAL VALIDAÇÃO DO TIPO DE PROCESSO */
  private tipoProcesso = signal<RecordType | null>(null);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType | undefined>();
  public registroAtual = input<RecordType | undefined>();
  public buscarPerfil = input<PerfilModel>({ ...INICIALIZAR_PERFIL_ENTITY });
  public onMudarOperacao = output<OperationType>();

  /* INICIALIZAR O PROCESSO */
  ngOnInit(): void {
    if (this.buscarPerfil()?.status && this.registroAtual() === RecordMap.STATUS) {
      this.carregarRegistro(RecordMap.INATIVAR);
      this.tipoProcesso.set(RecordMap.INATIVAR);
    } else if (!this.buscarPerfil()?.status && this.registroAtual() === RecordMap.STATUS) {
      this.carregarRegistro(RecordMap.ATIVAR);
      this.tipoProcesso.set(RecordMap.ATIVAR);
    } else {
      this.carregarRegistro(this.registroAtual()!);
      this.tipoProcesso.set(RecordMap.ELIMINAR);
    }
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.perfilService.listar();
  }

  /* FUNÇÃO DE INATIVAR, ATIVAR E ELIMINAR */
  protected executar(event: Event): void {
    event.preventDefault();

    const id = this.buscarPerfil()!.id;

    if (this.tipoProcesso() === RecordMap.ATIVAR) {
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ATIVAR,
          entidade: 'perfil',
          dados: this.buscarPerfil()?.descricao.toUpperCase(),
          acao: () => this.perfilService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Ativação do perfil',
              dados: this.buscarPerfil()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Ativação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Ativação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      console.log('INATIVAR');
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_INATIVAR,
          entidade: 'perfil',
          dados: this.buscarPerfil()?.descricao.toUpperCase(),
          acao: () => this.perfilService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Inativação do perfil',
              dados: this.buscarPerfil()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Inativação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Inativação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      console.log('ELIMINAR');
      this.confirmarService
        .confirmar({
          ...CONFIRMAR_ELIMINAR,
          entidade: 'perfil',
          dados: this.buscarPerfil()!.descricao.toUpperCase(),
          acao: () => this.perfilService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              ...FINALIZAR_SUCESSO,
              operacao: 'Eliminação do perfil',
              dados: this.buscarPerfil()!.descricao,
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              ...FINALIZAR_ERRO,
              operacao: 'Eliminação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              ...FINALIZAR_CANCELAR,
              operacao: 'Eliminação do perfil',
              dados: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
            });
          }
        });
    }
  }

  /* FUNÇÃO DE CARREGAR A TELA DE INATIVAR, ATIVAR E ELIMINAR */
  protected carregarRegistro(registro: RecordType): void {
    const carregar = DataProcessPerfil.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
