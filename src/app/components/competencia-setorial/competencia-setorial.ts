import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ListCompetenciaSetorial } from './operation/list-competencia-setorial/list-competencia-setorial';
import { GestorService } from '../../services/gestor.service';
import { OperationMap, OperationType } from '../../constants/operation-map.const';
import { InicialCompetenciaSetorial } from './operation/inicial-competencia-setorial/inicial-competencia-setorial';
import { CompetenciaSetorialService } from '../../services/competencia-setorial.service';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditoriaModel } from '../../entities/auditoria.model';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';
import { AuthService } from '../../services/auth.service';
import { AuditCompetenciaSetorial } from './operation/audit-competencia-setorial/audit-competencia-setorial';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormCompetenciaSetorial } from './operation/form-competencia-setorial/form-competencia-setorial';

@Component({
  selector: 'app-competencia-setorial',
  imports: [
    MatIconModule,
    MatButtonModule,
    ListCompetenciaSetorial,
    InicialCompetenciaSetorial,
    AuditCompetenciaSetorial,
    FormCompetenciaSetorial,
  ],
  templateUrl: './competencia-setorial.html',
  styleUrl: './competencia-setorial.scss',
})
export class CompetenciaSetorial implements OnInit, OnDestroy {
  private gestorService = inject(GestorService);
  private competenciaSetorialService = inject(CompetenciaSetorialService);
  private auditoriaService = inject(AuditoriaService);
  private authService = inject(AuthService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.gestorService.listarGestorCompetencia;
  protected readonly contador = this.competenciaSetorialService.contadorCompetenciaSetorial;
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaModel>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected usuarioId = signal<string | null>(null);
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected auditoriaEstado = signal<boolean>(true);

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregarTodos().subscribe();
    this.carregarContador().subscribe();
  }

  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.gestorService.limparBuscar();
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregarTodos() {
    return this.gestorService.listarCompetencia();
  }

  /* FUNÇÃO DE CARREGAMENTO DE CONTADOR */
  protected carregarContador() {
    return this.competenciaSetorialService.counter();
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA DE AUDITORIA */
  protected carregarAuditoria(query: string) {
    return this.auditoriaService.listarMais(query);
  }

  /* FUNÇÃO DE MUDANÇA DE OPERAÇÃO */
  protected mudarOperacao(operacao: OperationType, item?: string): void {
    if (operacao === OperationMap.HISTORICO) {
      const ctx = this.authService.getPerfil()?.id!;
      this.carregarRegistro(ctx);
      this.operacaoEstado.set(operacao);
    } else if (operacao === OperationMap.REGISTRO) {
      this.usuarioId.set(item!);
      this.operacaoEstado.set(operacao);
    } else {
      this.operacaoEstado.set(operacao);
    }
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
    const entidade = 'COMPETENCIASETORIAL';
    const query: string = `registradoPorId=${id}&entidade=${entidade}`;
    this.carregarAuditoria(query).subscribe();
  }
}
