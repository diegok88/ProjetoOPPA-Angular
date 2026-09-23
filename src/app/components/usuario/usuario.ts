import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { UsuarioData } from '../../interfaces/usuario-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { UsuarioService } from '../../services/usuario.service';
import {
  Escalas,
  INICIALIZAR_USUARIO_ENTITY,
  INICIALIZAR_USUARIO_FORMS,
  UsuarioModel,
} from '../../entities/usuario.model';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../constants/operation-map.const';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';
import { AuditUsuario } from './operation/audit-usuario/audit-usuario';
import { FormUsuario } from './operation/form-usuario/form-usuario';
import { InfoUsuario } from './operation/info-usuario/info-usuario';
import { InicialUsuario } from './operation/inicial-usuario/inicial-usuario';
import { ListUsuario } from './operation/list-usuario/list-usuario';
import { ProcessUsuario } from './operation/process-usuario/process-usuario';
import { MatIconModule } from '@angular/material/icon';
import { Toogle } from '../toogle/toogle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-usuario',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    AuditUsuario,
    FormUsuario,
    InfoUsuario,
    InicialUsuario,
    ListUsuario,
    ProcessUsuario,
    Toogle,
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Usuario implements OnInit {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private usuarioService = inject(UsuarioService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.usuarioService.usuario;
  protected readonly buscar = signal<UsuarioModel>(INICIALIZAR_USUARIO_ENTITY());
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  protected escalas = Escalas;

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<OperationType>(OperationMap.INICIAL);
  protected registroEstado = signal<RecordType>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected usuarioModel = signal<UsuarioData>(INICIALIZAR_USUARIO_FORMS());

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregar().subscribe();
  }
  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregar() {
    return this.usuarioService.listar();
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
    this.buscar.set(INICIALIZAR_USUARIO_ENTITY());
    this.operacaoEstado.set(operacao);
  }
  /* FUNÇÃO DE MUDANÇA DE REGISTRO */
  protected mudarRegistro(registro: RecordType): void {
    if (registro === RecordMap.ATUALIZAR) {
      this.resetForm();
      this.usuarioModel.set(INICIALIZAR_USUARIO_FORMS());
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
    this.carregar().subscribe({
      next: () => {
        const dado = this.listar().find((item) => item.id === id);
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
          console.log(this.listarAuditoria());
          this.buscar.set(dado);
          this.usuarioModel.set(this.buscar());
        }
      },
    });
  }

  /* FUNÇÃO DE INICIALIZAÇÃO DO FORMULARIO */
  private resetForm(): void {
    this.usuarioModel.set(INICIALIZAR_USUARIO_FORMS());
  }
}
