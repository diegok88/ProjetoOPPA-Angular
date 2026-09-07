export interface EmpresaModel {
  id?: string;
  codigo?: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  contato: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  status?: boolean;
}

export const EmpresaMap = {
  CNPJ: 'cnpj',
  RAZAO_SOCIAL: 'razaoSocial',
  NOME_FANTASIA: 'nomeFantasia',
  CONTATO: 'contato',
  EMAIL: 'email',
  RUA: 'rua',
  NUMERO: 'numero',
  BAIRRO: 'bairro',
  CIDADE: 'cidade',
  ESTADO: 'estado',
  CEP: 'cep',
} as const;

export type EmpresaType = (typeof EmpresaMap)[keyof typeof EmpresaMap];

export const INICIALIZAR_EMPRESA_ENTITY: EmpresaModel = {
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

export const INICIALIZAR_EMPRESA_FORMS: EmpresaModel = {
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
} as const;
