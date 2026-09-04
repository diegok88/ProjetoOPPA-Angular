import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { PerfilService } from '../../../../services/perfil.service';
import { PerfilData } from '../../../../interfaces/perfil-data.interface';
import { OperationType, RecordMap, RecordType } from '../../../../const/operation-map.const';
import { DataProcessPerfil } from '../../../../const/data-process.const';
import { ConfigProcess } from '../../../../interfaces/config-process.interface';

@Component({
  selector: 'app-process-perfil',
  imports: [MatButtonModule],
  template: `
    <div class="registro-inativar">
      <form (ngSubmit)="executar($event)" class="operacao-forms">
        <div class="container-imagem">
          <img class="image-eliminar" [src]="listaProcessoSignal()?.imagem" alt="Lixeira" />
          <span>{{ listaProcessoSignal()?.mensagem }} {{ buscarPerfil()?.descricao }}?</span>
        </div>
        <button matButton="outlined" type="submit">
          {{ listaProcessoSignal()?.botao }}
        </button>
      </form>
    </div>
  `,
  styles: ``,
})
export class ProcessPerfil implements OnInit {
  /* MODAIS DE CONFIRMAÇÃO E VALIDAÇÃO */
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);

  /* SERVIÇO DE COMUNICAÇÃO COM O BACKEND */
  private perfilService = inject(PerfilService);
  private listaProcesso = DataProcessPerfil;
  protected listaProcessoSignal = signal<ConfigProcess | null>(null);

  /* ENTRADA E SAIDA DE DADOS DO COMPONENTE */
  public operacaoAtual = input<OperationType>();
  public registroAtual = input<RecordType>();
  public buscarPerfil = input<PerfilData | null>(null);
  public onMudarOperacao = output<OperationType>();

  /* VALIDAÇÕES DO MODELO */
  protected formSubmitted = signal<boolean>(false);

  /* INICIALIZAR O PROCESSO */
  ngOnInit(): void {
    this.carregarRegistro(this.registroAtual()!);
  }

  /* FUNÇÃO DE CARREGAMENTO A CADA SERVIÇO CONCLUIDO */
  protected carregar() {
    return this.perfilService.listar();
  }
  /* FUNÇÃO DE INATIVAR, ATIVAR E ELIMINAR */
  protected executar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.buscarPerfil()?.status) {
      alert('Perfil já está inativo!');
      return;
    }

    const id = this.buscarPerfil()?.id;

    if (this.operacaoAtual()?.includes(RecordMap.INATIVAR)) {
      this.confirmarService
        .confirmar({
          icone: '/icons/block_84.png',
          titulo: 'Inativar Perfil',
          mensagem: `Deseja confirmar a inativação da perfil ${this.buscarPerfil()?.descricao.toUpperCase()}?`,
          acao: () => this.perfilService.inativar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit('registro');
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              icone: '/icons/check_circle_84.png',
              operacao: this.buscarPerfil()!.descricao,
              titulo: 'Sucesso!',
              mensagem: 'Inativação com exíto.',
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
    } else if (this.operacaoAtual()?.includes(RecordMap.ELIMINAR)) {
      this.confirmarService
        .confirmar({
          icone: '/icons/delete_84.png',
          titulo: 'Eliminar Perfil',
          mensagem: `Deseja confirmar a eliminação da perfil ${this.buscarPerfil()!.descricao.toUpperCase()}?`,
          acao: () => this.perfilService.deletar(id!),
        })
        .subscribe((confirmado) => {
          if (confirmado === 'finalizado') {
            this.onMudarOperacao.emit('inicial');
            this.carregar().subscribe();
            this.finalizarService.finalizar({
              icone: '/icons/check_circle_84.png',
              operacao: this.buscarPerfil()!.descricao,
              titulo: 'Sucesso!',
              mensagem: 'Eliminação com exíto.',
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

  protected carregarRegistro(registro: RecordType): void {
    const carregar = this.listaProcesso.find((r) => r.processo === registro)!;
    this.listaProcessoSignal.set(carregar);
  }
}
