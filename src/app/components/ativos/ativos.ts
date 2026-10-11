import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AtivosService } from '../../services/ativos.service';
import { AuthService } from '../../services/auth.service';
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
import { AtivosForm, INICIALIZAR_ATIVOS_FORMS } from '../../entities/ativos.model';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { Toogle } from '../toogle/toogle';
import { AuditAtivos } from './operation/audit-ativos/audit-ativos';
import { FormAtivos } from './operation/form-ativos/form-ativos';
import { InfoAtivos } from './operation/info-ativos/info-ativos';
import { InicialAtivos } from './operation/inicial-ativos/inicial-ativos';
import { ListAtivos } from './operation/list-ativos/list-ativos';
import { ProcessAtivos } from './operation/process-ativos/process-ativos';

@Component({
  selector: 'app-ativo',
  imports: [
    FormsModule,
    InicialAtivos,
    ListAtivos,
    FormAtivos,
    Toogle,
    InfoAtivos,
    ProcessAtivos,
    AuditAtivos,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './ativos.html',
  styleUrl: './ativos.scss',
})
export class Ativos implements OnInit, OnDestroy {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private ativosService = inject(AtivosService);
  private authService = inject(AuthService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.ativosService.listarAtivos;
  protected readonly buscar = this.ativosService.buscarAtivo;
  protected readonly contador = this.ativosService.contadorAtivos;
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({
    ...INICIALIZAR_AUDITORIA_ENTITY,
  });

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected ativosModel = signal<AtivosForm>(INICIALIZAR_ATIVOS_FORMS());

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregarTodos().subscribe();
    this.carregarContador().subscribe();
  }

  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.ativosService.limparBuscar();
  }

  /*
  FUNÇÃO DE AUTORIZAÇÃO PELO PERFIL DO USUARIO:
  - Inicializa a tela inicial de acordo com o perfil.
  - Garante as operações que cada perfil pode executar.
  */
  protected initialAuthorization = computed(() => {
    if (this.authService.getRole() === ROLES_MAP.ASN1) return true;
    return false;
  });

  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregarTodos() {
    const empresa = this.authService.getPerfil()?.empresaId;
    const campos = 'id,codigo,descricao,modelo';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.ativosService.listar(query);
  }

  /* FUNÇÃO DE CARREGAMENTO DE CONTADOR */
  protected carregarContador() {
    return this.ativosService.counter();
  }

  /* FUNÇÃO DE CARREGAMENTO O DADO SELECIONADO */
  protected carregarDado(id: string) {
    return this.ativosService.buscar(id);
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA DE AUDITORIA */
  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

  /* FUNÇÃO DE MUDANÇA DE OPERAÇÃO */
  protected mudarOperacao(operacao: OperationType, item?: string): void {
    /* Se operação estiver vazia inicializa na tela INICIAL */
    if (!operacao) this.operacaoEstado.set(OperationMap.INICIAL);
    if (operacao === OperationMap.REGISTRO) {
      /* Carrega os dados do ativo se o perfil for diferente de ASSISTENCIA */
      if (!this.initialAuthorization()) {
        const dado = this.listar()?.[0]?.id ?? '';
        this.carregarDado(dado).subscribe();
        this.carregarRegistro(dado);
      }
      this.mudarRegistro(RecordMap.INFORMACAO);
      if (item) this.carregarRegistro(item);
      else this.operacaoEstado.set(OperationMap.INICIAL);
    }
    this.operacaoEstado.set(operacao);
  }

  /* FUNÇÃO DE MUDANÇA DE REGISTRO */
  protected mudarRegistro(registro: RecordType): void {
    this.auditoriaEstado.set(true);
    this.registroEstado.set(registro);
  }

  /* FUNÇÃO DE MUDANÇA DE AUDITORIA */
  protected mudarAuditoria(dados?: AuditoriaData): void {
    if (this.auditoriaEstado() && dados) {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(dados);
    } else {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set({ ...INICIALIZAR_AUDITORIA_ENTITY });
    }
  }

  /* FUNÇÃO DE CARREGAMENTO DE INFORMAÇÕES PARA AUDITORIA E REGISTRO */
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
