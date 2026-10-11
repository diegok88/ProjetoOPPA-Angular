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
import { FalhasService } from '../../services/falhas.service';
import { Toogle } from '../toogle/toogle';
import { AuditFalhas } from './operation/audit-falhas/audit-falhas';
import { FormFalhas } from './operation/form-falhas/form-falhas';
import { InfoFalhas } from './operation/info-falhas/info-falhas';
import { InicialFalhas } from './operation/inicial-falhas/inicial-falhas';
import { ProcessFalhas } from './operation/process-falhas/process-falhas';
import { ListFalhas } from './operation/list-falhas/list-falhas';
import { FalhasForm, INICIALIZAR_FALHAS_FORMS } from '../../entities/falhas.model';
@Component({
  selector: 'app-falhas',
  imports: [
    FormsModule,
    InicialFalhas,
    ListFalhas,
    FormFalhas,
    Toogle,
    InfoFalhas,
    ProcessFalhas,
    AuditFalhas,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './falhas.html',
  styleUrl: './falhas.scss',
})
export class Falhas implements OnInit, OnDestroy {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private falhasService = inject(FalhasService);
  private authService = inject(AuthService);
  private auditoriaService = inject(AuditoriaService);
  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.falhasService.listarFalhas;
  protected readonly buscar = this.falhasService.buscarFalha;
  protected readonly contador = this.falhasService.contadorFalhas;
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({
    ...INICIALIZAR_AUDITORIA_ENTITY,
  });
  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);
  protected falhasModel = signal<FalhasForm>(INICIALIZAR_FALHAS_FORMS());
  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;
  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregarTodos().subscribe();
    this.carregarContador().subscribe();
  }
  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.falhasService.limparBuscar();
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
    const campos = 'id,codigo,descricao';
    const query = `empresaId=${empresa}&campos=${campos}`;
    return this.falhasService.listar(query);
  }
  /* FUNÇÃO DE CARREGAMENTO DE CONTADOR */
  protected carregarContador() {
    return this.falhasService.counter();
  }
  /* FUNÇÃO DE CARREGAMENTO O DADO SELECIONADO */
  protected carregarDado(id: string) {
    return this.falhasService.buscar(id);
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
      /* Carrega os dados da falha se o perfil for diferente de ASSISTENCIA */
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
