import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { EmpresaService } from '../../services/empresa.service';
import {
  EmpresaForm,
  EmpresaModel,
  INICIALIZAR_EMPRESA_ENTITY,
  INICIALIZAR_EMPRESA_FORMS,
} from '../../entities/empresa.model';
import { ListEmpresa } from './operation/list-empresa/list-empresa';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../constants/operation-map.const';
import { InicialEmpresa } from './operation/inicial-empresa/inicial-empresa';
import { FormEmpresa } from './operation/form-empresa/form-empresa';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';
import { Toogle } from '../toogle/toogle';
import { InfoEmpresa } from './operation/info-empresa/info-empresa';
import { AuditEmpresa } from './operation/audit-empresa/audit-empresa';
import { ProcessEmpresa } from './operation/process-empresa/process-empresa';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empresa',
  imports: [
    FormsModule,
    InicialEmpresa,
    ListEmpresa,
    FormEmpresa,
    Toogle,
    InfoEmpresa,
    ProcessEmpresa,
    AuditEmpresa,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './empresa.html',
  styleUrl: './empresa.scss',
})
export class Empresa implements OnInit {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private empresaService = inject(EmpresaService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.empresaService.empresa;
  protected readonly buscar = signal<EmpresaModel>({ ...INICIALIZAR_EMPRESA_ENTITY });
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected empresaModel = signal<EmpresaForm>({ ...INICIALIZAR_EMPRESA_FORMS });

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregar().subscribe();
  }
  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregar() {
    return this.empresaService.listar();
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
      this.resetForm();
    }
    if (operacao === OperationMap.CADASTRAR) {
      this.resetForm();
    }
    this.buscar.set({ ...INICIALIZAR_EMPRESA_ENTITY });
    this.operacaoEstado.set(operacao);
  }

  /* FUNÇÃO DE MUDANÇA DE REGISTRO */
  protected mudarRegistro(registro: RecordType): void {
    if (registro === RecordMap.ATUALIZAR) {
      this.resetForm();
      this.empresaModel.set(this.buscar());
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
    this.carregar().subscribe({
      next: () => {
        const dado = this.listar().find((item) => item.id === id);
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
          this.buscar.set(dado);
          this.empresaModel.set(this.buscar());
        }
      },
    });
  }

  /* FUNÇÃO DE INICIALIZAÇÃO DO FORMULARIO */
  private resetForm(): void {
    this.empresaModel.set({ ...INICIALIZAR_EMPRESA_FORMS });
  }
}
