import { AuditoriaData } from '../interfaces/auditoria-data.interface';
import { EmpresaData } from '../interfaces/empresa-data.interface';

/* CONSTANTES DE INICIALIZAÇÃO DE ENTIDADES DE BUSCA */

export const INICIALIZAR_EMPRESA_ENTITY: EmpresaData = {
  id: '',
  codigo: undefined,
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  contato: '',
  email: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  status: undefined,
} as const;

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
