export interface SolucoesModel {
  id?: string;
  codigo?: number;
  falhaId: string;
  falha?: { codigo: string; descricao: string } | null;
  direcionamentoId: string;
  perfil?: { descricao: string; nivel: string } | null;
  descricao: string;
  status?: boolean;
}

export interface SolucoesForm {
  falhaId: string;
  direcionamentoId: string;
  descricao: string;
}

export const CamposSolucoes: (keyof SolucoesForm)[] = ['falhaId', 'direcionamentoId', 'descricao'];

export const CamposSolucoesNumeros: (keyof SolucoesForm)[] = [];

export const CamposSolucoesLetras: (keyof SolucoesForm)[] = [];

export const CamposSolucoesLivres: (keyof SolucoesForm)[] = ['descricao'];

export const SolucoesMap = {
  ID: 'id',
  CODIGO: 'codigo',
  FALHA_ID: 'falhaId',
  DIRECIONAMENTO_ID: 'direcionamentoId',
  DESCRICAO: 'descricao',
  STATUS: 'status',
} as const;

export type SolucoesType = (typeof SolucoesMap)[keyof typeof SolucoesMap];

export const INICIALIZAR_SOLUCOES_ENTITY = (): SolucoesModel => ({
  id: '',
  codigo: undefined,
  falhaId: '',
  falha: undefined,
  direcionamentoId: '',
  perfil: undefined,
  descricao: '',
  status: undefined,
});

export const INICIALIZAR_SOLUCOES_FORMS = (): SolucoesForm => ({
  falhaId: '',
  direcionamentoId: '',
  descricao: '',
});

export type ErrorSolucoesType =
  // Falha Id
  | 'emptyFalhaId'
  | 'equalFalhaId'
  // Descrição
  | 'emptyDescricao'
  | 'equalDescricao'
  | 'invalidCharDescricao'
  // Direcionamento Id
  | 'emptyDirecionamentoId'
  | 'equalDirecionamentoId'
  | null;

export function getErrorSolucoesMessage(error: ErrorSolucoesType): string {
  switch (error) {
    // ─── Falha Id ───
    case 'emptyFalhaId':
      return 'A Falha é obrigatória.';
    case 'equalFalhaId':
      return 'A Falha informada é igual à anterior!';
    // ─── Descrição ───
    case 'emptyDescricao':
      return 'A Descrição é obrigatória.';
    case 'equalDescricao':
      return 'A Descrição informada é igual à anterior!';
    case 'invalidCharDescricao':
      return 'A Descrição não aceita caracteres especiais.';
    // ─── Direcionamento Id ───
    case 'emptyDirecionamentoId':
      return 'O Direcionamento é obrigatório.';
    case 'equalDirecionamentoId':
      return 'O Direcionamento informado é igual ao anterior!';
    default:
      return '';
  }
}
