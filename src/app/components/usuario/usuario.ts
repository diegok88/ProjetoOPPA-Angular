import { Component, inject, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { UsuarioData } from '../../interfaces/usuario-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { UsuarioService } from '../../services/usuario.service';
import { Escalas, INICIALIZAR_USUARIO_FORMS } from '../../entities/usuario.model';
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
import { GestorService } from '../../services/gestor.service';

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
export class Usuario implements OnInit, OnDestroy {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private usuarioService = inject(UsuarioService);
  private gestorService = inject(GestorService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.gestorService.listarGestor;
  protected readonly buscar = this.usuarioService.buscarUsuario;
  protected readonly contador = this.usuarioService.contadorUsuario;
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
    this.carregarTodos().subscribe();
    this.carregarContador().subscribe();
  }

  /* CICLO DE VIDA PARA LIMPAR O DADO DA BUSCA */
  ngOnDestroy(): void {
    this.usuarioService.limparBuscar();
    this.gestorService.limparBuscar();
  }

  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregarTodos() {
    return this.gestorService.listarTabela();
  }

  /* FUNÇÃO DE CARREGAMENTO DE CONTADOR */
  protected carregarContador() {
    return this.usuarioService.counter();
  }

  /* FUNÇÃO DE CARREGAMENTO O DADO SELECIONADO */
  protected carregarDado(id: string) {
    return this.usuarioService.buscar(id);
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
