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

export const TOUCHED_EMPRESA_MAP: Record<EmpresaType, string> = {
  [EmpresaMap.CNPJ]: 'cnpjTouched',
  [EmpresaMap.RAZAO_SOCIAL]: 'razaoSocialTouched',
  [EmpresaMap.NOME_FANTASIA]: 'nomeFantasiaTouched',
  [EmpresaMap.CONTATO]: 'contatoTouched',
  [EmpresaMap.EMAIL]: 'emailTouched',
  [EmpresaMap.RUA]: 'ruaTouched',
  [EmpresaMap.NUMERO]: 'numeroTouched',
  [EmpresaMap.BAIRRO]: 'bairroTouched',
  [EmpresaMap.CIDADE]: 'cidadeTouched',
  [EmpresaMap.ESTADO]: 'estadoTouched',
  [EmpresaMap.CEP]: 'cepTouched',
} as const;

export type ErrorEmpresaType = 'emptyCnpj' | 'equalCnpj' | null;

export function getErrorMessage(error: ErrorEmpresaType): string {
  switch (error) {
    case 'emptyCnpj':
      return 'O cnpj é obrigatório.';
    case 'equalCnpj':
      return 'O cnpj é igual ao anterior!';
    default:
      return '';
  }
}
