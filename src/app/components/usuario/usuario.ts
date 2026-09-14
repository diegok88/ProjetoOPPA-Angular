import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { UsuarioData } from '../../interfaces/usuario-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { PerfilService } from '../../services/perfil.service';
import { UsuarioService } from '../../services/usuario.service';
import {
  Escalas,
  INICIALIZAR_USUARIO_ENTITY,
  INICIALIZAR_USUARIO_FORMS,
  UsuarioModel,
} from '../../entities/usuario.model';
import { EmpresaService } from '../../services/empresa.service';
import {
  OperationMap,
  OperationType,
  RecordMap,
  RecordType,
} from '../../constants/operation-map.const';
import { INICIALIZAR_AUDITORIA_ENTITY } from '../../constants/inicialize-auditoria.const';

@Component({
  selector: 'app-usuario',
  imports: [FormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Usuario implements OnInit {
  /* INJEÇÃO DE DEPENDENCIAS DE SERVIÇOS */
  private usuarioService = inject(UsuarioService);
  private perfilService = inject(PerfilService);
  private empresaService = inject(EmpresaService);
  private auditoriaService = inject(AuditoriaService);

  /* DADOS RETORNADOS DO SERVIÇO */
  protected readonly listar = this.usuarioService.usuario;
  protected readonly buscar = signal<UsuarioModel>({ ...INICIALIZAR_USUARIO_ENTITY });
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData>({ ...INICIALIZAR_AUDITORIA_ENTITY });

  protected escalas = Escalas;

  /* SIGNALS DAS ROTAS DE OPERAÇÃO E REGISTRO */
  protected operacaoEstado = signal<string>(OperationMap.INICIAL);
  protected registroEstado = signal<string>(RecordMap.INFORMACAO);
  protected auditoriaEstado = signal<boolean>(true);

  protected usuarioModel = signal<UsuarioData>({ ...INICIALIZAR_USUARIO_FORMS });

  /* ROTAS DE OPERAÇÃO */
  protected operationMap = OperationMap;

  /* CICLO DE VIDA PARA INICIALIZAR A LISTA */
  ngOnInit(): void {
    this.carregar().subscribe();
  }
  /* FUNÇÃO DE CARREGAMENTO DE LISTA */
  protected carregar() {
    return this.usuarioService.listarAssist();
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
    this.buscar.set({ ...INICIALIZAR_USUARIO_ENTITY });
    this.operacaoEstado.set(operacao);
  }
  /* FUNÇÃO DE MUDANÇA DE REGISTRO */
  protected mudarRegistro(registro: RecordType): void {
    if (registro === RecordMap.ATUALIZAR) {
      this.resetForm();
      this.usuarioModel.set({ ...INICIALIZAR_USUARIO_FORMS });
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
    this.usuarioModel.set({
      ...INICIALIZAR_USUARIO_FORMS,
    });
  }
}
