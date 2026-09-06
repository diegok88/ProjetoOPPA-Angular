import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { PerfilService } from '../../services/perfil.service';
import { FormPerfil } from './operation/form-perfil/form-perfil';
import { InfoPerfil } from './operation/info-perfil/info-perfil';
import { InicialPerfil } from './operation/inicial-perfil/inicial-perfil';
import { ListPerfil } from './operation/list-perfil/list-perfil';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../const/operation-map.const';
import { ProcessPerfil } from './operation/process-perfil/process-perfil';
import { AuditPerfil } from './operation/audit-perfil/audit-perfil';
import { Toogle } from '../toogle/toogle';
import {
  INICIALIZAR_PERFIL_ENTITY,
  INICIALIZAR_PERFIL_FORMS,
  PerfilModel,
} from '../../entities/perfil.model';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../const/inicialize-entities.const';

@Component({
  selector: 'app-perfil',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ListPerfil,
    InicialPerfil,
    FormPerfil,
    InfoPerfil,
    ProcessPerfil,
    AuditPerfil,
    Toogle,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);
  private auditoriaService = inject(AuditoriaService);

  protected readonly listar = this.perfilService.perfil;
  protected readonly buscar = signal<PerfilModel>({ ...INICIALIZAR_PERFIL_ENTITY });
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected perfilModel = signal<PerfilModel>({ ...INICIALIZAR_PERFIL_FORMS });

  protected operationMap = OperationMap;

  ngOnInit(): void {
    this.carregar().subscribe();
  }

  protected carregar() {
    return this.perfilService.listar();
  }

  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

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
    this.buscar.set({ ...INICIALIZAR_PERFIL_ENTITY });
    this.operacaoEstado.set(operacao);
  }

  protected mudarRegistro(registro: RecordType): void {
    if (registro === RecordMap.ATUALIZAR) {
      this.resetForm();
      this.perfilModel.set({ descricao: this.buscar()!.descricao });
      this.registroEstado.set(registro);
    }
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
    this.carregar().subscribe({
      next: () => {
        const dado = this.listar().find((item) => item.id === id);
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
          console.log(this.listarAuditoria());
          this.buscar.set(dado);
          this.perfilModel.set({ descricao: dado.descricao });
        }
      },
    });
  }

  private resetForm(): void {
    this.perfilModel.set({ ...INICIALIZAR_PERFIL_FORMS });
  }
}
