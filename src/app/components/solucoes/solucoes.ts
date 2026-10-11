import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';
import {
  OperationType,
  OperationMap,
  RecordType,
  RecordMap,
} from '../../constants/operation-map.const';
import { ROLES_MAP } from '../../constants/role-map.const';

import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuthService } from '../../services/auth.service';
import { SolucoesService } from '../../services/solucoes.service';
import { Toogle } from '../toogle/toogle';
import { FormSolucoes } from './operation/form-solucoes/form-solucoes';
import { InfoSolucoes } from './operation/info-solucoes/info-solucoes';
import { InicialSolucoes } from './operation/inicial-solucoes/inicial-solucoes';
import { ProcessSolucoes } from './operation/process-solucoes/process-solucoes';
import { ListSolucoes } from './operation/list-solucoes/list-solucoes';
import { SolucoesForm, INICIALIZAR_SOLUCOES_FORMS } from '../../entities/solucoes.model';
import { AtivosService } from '../../services/ativos.service';
import { SubListSolucoes } from './operation/sub-list-solucoes/sub-list-solucoes';
import { Auditoria } from '../auditoria/auditoria';

@Component({
  selector: 'app-solucoes',
  imports: [
    FormsModule,
    InicialSolucoes,
    ListSolucoes,
    FormSolucoes,
    Toogle,
    InfoSolucoes,
    Auditoria,
    SubListSolucoes,
    ProcessSolucoes,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './solucoes.html',
  styleUrl: './solucoes.scss',
})
export class Solucoes implements OnInit, OnDestroy {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private solucoesService = inject(SolucoesService);
  private ativosService = inject(AtivosService);
  private authService = inject(AuthService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.solucoesService.listarSolucoes;
  protected readonly buscar = this.solucoesService.buscarSolucao;
  protected readonly contador = this.solucoesService.contadorSolucoes;
  protected readonly listarAtivos = this.ativosService.listarAtivos;
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({
    ...INICIALIZAR_AUDITORIA_ENTITY,
  });

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);
  protected itemAtivo = signal<string | null>(null);

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregarAtivos().subscribe();
    this.carregarContador().subscribe();
  }

  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.solucoesService.limparBuscar();
  }

  /* SIGNAL PARA AUTORIZAR OPERAÇÃO DE ACORDO COM  O PERFIL */
  protected initialAuthorization = computed(() => {
    if (this.authService.getRole() === ROLES_MAP.ASN1) return true;
    return false;
  });

  /* FUNÇÃO DE CARREGAMENTO DE LISTA - Aplicado na sub-lista */
  private carregarSolucoes(ativoId: string | undefined) {
    const incluir = 'falha_parcial';
    const query = `ativoId=${ativoId}&incluir=${incluir}`;
    return this.solucoesService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA - Aplicado na lista */
  private carregarAtivos() {
    const enterprise = this.authService.getPerfil()?.empresaId;
    const field = 'id,codigo,descricao,modelo';
    const query = `empresaId=${enterprise}&campos=${field}`;
    return this.ativosService.listar(query);
  }

  protected carregarContador() {
    return this.solucoesService.counter();
  }

  protected carregarDado(id: string) {
    return this.solucoesService.buscar(id);
  }

  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

  protected mudarOperacao(operacao: OperationType, item?: string): void {
    if (!operacao || operacao === OperationMap.INICIAL) {
      this.itemAtivo.set(null);
      this.operacaoEstado.set(OperationMap.INICIAL);
    }
    if (operacao === OperationMap.SUB_LISTA && item) {
      if (!this.itemAtivo()) this.itemAtivo.set(item);
      if (this.itemAtivo() !== item) {
        this.itemAtivo.set(item);
      }
      const ativoId = this.itemAtivo() ?? item;
      this.operacaoEstado.set(operacao);
      this.carregarSolucoes(ativoId).subscribe();
    }
    if (operacao === OperationMap.REGISTRO && item) {
      this.carregarRegistro(item);
      this.mudarRegistro(RecordMap.INFORMACAO);
    }
    this.operacaoEstado.set(operacao);
  }

  protected mudarRegistro(registro: RecordType): void {
    this.auditoriaEstado.set(true);
    this.registroEstado.set(registro);
  }

  protected mudarAuditoria(dados?: AuditoriaData): void {
    if (this.auditoriaEstado() && dados) {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(dados);
    } else {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set({ ...INICIALIZAR_AUDITORIA_ENTITY });
    }
  }

  private carregarRegistro(id: string): void {
    this.carregarDado(id).subscribe({
      next: (dado) => {
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
        }
      },
    });
  }
}
