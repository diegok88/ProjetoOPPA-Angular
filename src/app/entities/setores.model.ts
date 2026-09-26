/* MODELO DA ENTIDADE */
export interface SetoresModel {
  id?: string;
  codigo?: number;
  descricao: string;
  empresaId?: string;
  status?: boolean;
  nomeEmpresa?: string;
}

export interface SetoresForm {
  descricao: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposSetores: (keyof SetoresForm)[] = ['descricao'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposSetoresNumeros: (keyof SetoresForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposSetoresLetras: (keyof SetoresForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposSetoresLivres: (keyof SetoresForm)[] = ['descricao'];

/* MAPEAMENTO DA ENTIDADE */
export const SetoresMap = {
  DESCRICAO: 'descricao',
} as const;

/* TIPOS DA ENTIDADE */
export type SetorType = (typeof SetoresMap)[keyof typeof SetoresMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_SETORES_ENTITY = (): SetoresModel => ({
  id: '',
  codigo: undefined,
  descricao: '',
  empresaId: '',
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_SETORES_FORMS = (): SetoresForm => ({
  descricao: '',
});

/* TIPOS DE FALHAS */
export type ErrorSetoresType =
  // DESCRIÇÃO
  | 'emptyDescricao'
  | 'equalDescricao'
  | 'equalListDescricao'
  | 'invalidCharDescricao'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorSetoresMessage(error: ErrorSetoresType): string {
  switch (error) {
    // ─── DESCRIÇÃO ───
    case 'emptyDescricao':
      return 'O descrição é obrigatório.';
    case 'equalDescricao':
      return 'O descrição informado é igual ao anterior!';
    case 'equalListDescricao':
      return 'O descrição informado já possui registro!';
    case 'invalidCharDescricao':
      return 'O descrição não aceita números.';

    default:
      return '';
  }
}
