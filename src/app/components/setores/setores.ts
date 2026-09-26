import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuditoriaService } from '../../services/auditoria.service';
import { SetoresService } from '../../services/setores.service';
import { INICIALIZAR_SETORES_FORMS, SetoresForm } from '../../entities/setores.model';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../constants/operation-map.const';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';
import { AuditSetores } from './operation/audit-setores/audit-setores';
import { FormSetores } from './operation/form-setores/form-setores';
import { InfoSetores } from './operation/info-setores/info-setores';
import { InicialSetores } from './operation/inicial-setores/inicial-setores';
import { ListSetores } from './operation/list-setores/list-setores';
import { ProcessSetores } from './operation/process-setores/process-setores';
import { Toogle } from '../toogle/toogle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuditoriaModel } from '../../entities/auditoria.model';

@Component({
  selector: 'app-setores',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    AuditSetores,
    FormSetores,
    InfoSetores,
    InicialSetores,
    ListSetores,
    ProcessSetores,
    Toogle,
  ],
  templateUrl: './setores.html',
  styleUrl: './setores.scss',
})
export class Setores implements OnInit, OnDestroy {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private setoresService = inject(SetoresService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.setoresService.listarSetores;
  protected readonly buscar = this.setoresService.buscarSetores;
  protected readonly contador = this.setoresService.contadorSetores;
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaModel>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected setoresModel = signal<SetoresForm>(INICIALIZAR_SETORES_FORMS());

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregarTodos().subscribe();
    this.carregarContador().subscribe();
  }

  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.setoresService.limparBuscar();
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregarTodos() {
    return this.setoresService.listarTabela();
  }

  /* FUNÇÃO DE CARREGAMENTO DE CONTADOR */
  protected carregarContador() {
    return this.setoresService.counter();
  }

  /* FUNÇÃO DE CARREGAMENTO O DADO SELECIONADO */
  protected carregarDado(id: string) {
    return this.setoresService.buscar(id);
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA DE AUDITORIA */
  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

  /* FUNÇÃO DE MUDANÇA DE OPERAÇÃO */
  protected mudarOperacao(operacao: OperationType, item?: string): void {
    if (!operacao) this.operacaoEstado.set(OperationMap.INICIAL);
    if (operacao === OperationMap.REGISTRO) {
      this.mudarRegistro(RecordMap.INFORMACAO);
      if (item) this.carregarRegistro(item);
      else this.operacaoEstado.set(OperationMap.INICIAL);
    }
    this.operacaoEstado.set(operacao);
  }

  /* FUNÇÃO DE MUDANÇA DE REGISTRO */
  protected mudarRegistro(registro: RecordType): void {
    if (registro === RecordMap.ATUALIZAR) {
      this.registroEstado.set(registro);
    }
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
