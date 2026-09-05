import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { PerfilService } from '../../../../services/perfil.service';
import { PerfilData } from '../../../../interfaces/perfil-data.interface';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../../../const/operation-map.const';
import { DataProcessPerfil } from '../../../../const/data-process.const';
import { ConfigProcess } from '../../../../interfaces/config-process.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-process-perfil',
  imports: [FormsModule, MatButtonModule],
  template: `
    <form (ngSubmit)="executar($event)" class="process-operacao">
      <section class="process-group">
        <img class="image-eliminar" [src]="listaProcessoSignal()?.imagem" alt="Lixeira" />
        <span>{{ listaProcessoSignal()?.mensagem }} {{ buscarPerfil()?.descricao }}?</span>
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
  public buscarPerfil = input<PerfilData | null>(null);
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
      console.log('ATIVAR');
      this.confirmarService
        .confirmar({
          icone: '/icons/check_circle_84.png',
          titulo: 'Ativar Perfil',
          mensagem: `Deseja confirmar a ativação da perfil ${this.buscarPerfil()?.descricao.toUpperCase()}?`,
          acao: () => this.perfilService.ativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              icone: '/icons/check_circle_84.png',
              operacao: this.buscarPerfil()!.descricao,
              titulo: 'Sucesso!',
              mensagem: 'Ativação realizado com exíto.',
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              icone: '/icons/error_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Erro!',
              mensagem: 'Falha no ativação.',
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              icone: '/icons/cancel_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Cancelado!',
              mensagem: 'Operação de ativação cancelada.',
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.INATIVAR) {
      console.log('INATIVAR');
      this.confirmarService
        .confirmar({
          icone: '/icons/block_84.png',
          titulo: 'Inativar Perfil',
          mensagem: `Deseja confirmar a inativação da perfil ${this.buscarPerfil()?.descricao.toUpperCase()}?`,
          acao: () => this.perfilService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.REGISTRO);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              icone: '/icons/check_circle_84.png',
              operacao: this.buscarPerfil()!.descricao,
              titulo: 'Sucesso!',
              mensagem: 'Inativação realizado com exíto.',
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              icone: '/icons/error_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Erro!',
              mensagem: 'Falha no inativação.',
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              icone: '/icons/cancel_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Cancelado!',
              mensagem: 'Operação de inativação cancelada.',
            });
          }
        });
    }

    if (this.tipoProcesso() === RecordMap.ELIMINAR) {
      console.log('ELIMINAR');
      this.confirmarService
        .confirmar({
          icone: '/icons/delete_84.png',
          titulo: 'Eliminar Perfil',
          mensagem: `Deseja confirmar a eliminação da perfil ${this.buscarPerfil()!.descricao.toUpperCase()}?`,
          acao: () => this.perfilService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit(OperationMap.INICIAL);
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              icone: '/icons/check_circle_84.png',
              operacao: this.buscarPerfil()!.descricao,
              titulo: 'Sucesso!',
              mensagem: 'Eliminação realizado com exíto.',
            });
          } else if (confirmado === 'erro') {
            this.finalizarService.finalizar({
              icone: '/icons/error_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Erro!',
              mensagem: 'Falha na eliminação.',
              erros: this.finalizarService.ultimosErros(),
            });
          } else {
            this.finalizarService.finalizar({
              icone: '/icons/cancel_84.png',
              operacao: this.buscarPerfil()!.descricao.toLocaleUpperCase(),
              titulo: 'Cancelado!',
              mensagem: 'Operação de eliminação cancelada.',
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
