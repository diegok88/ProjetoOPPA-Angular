import { AuditoriaData } from '../interfaces/auditoria-data.interface';

/* CONSTANTES DE INICIALIZAÇÃO DE ENTIDADES DE BUSCA */

export const INICIALIZAR_AUDITORIA_ENTITY: AuditoriaData = {
  id: '',
  entidade: '',
  registroId: '',
  acao: '',
  dadosRegistrados: '',
  dataHora: undefined,
  registradoPorId: '',
  empresaId: '',
} as const;
