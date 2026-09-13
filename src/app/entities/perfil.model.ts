/* MODELO DA ENTIDADE */
export interface PerfilModel {
  id?: string;
  codigo?: number;
  descricao: string;
  status?: boolean;
}

export interface PerfilForm {
  descricao: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposPerfil: (keyof PerfilForm)[] = ['descricao'] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposPerfilNumeros: (keyof PerfilForm)[] = [] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposPerfilLetras: (keyof PerfilForm)[] = [] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposPerfilLivres: (keyof PerfilForm)[] = ['descricao'] as const;

/* MAPEAMENTO DA ENTIDADE */
export const PerfilMap = {
  DESCRICAO: 'descricao',
} as const;

/* TIPOS DA ENTIDADE */
export type PerfilType = (typeof PerfilMap)[keyof typeof PerfilMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_PERFIL_ENTITY: PerfilModel = {
  id: '',
  codigo: undefined,
  descricao: '',
  status: undefined,
} as const;

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_PERFIL_FORMS: PerfilForm = {
  descricao: '',
} as const;

/* TIPOS DE FALHAS */
export type ErrorPerfilType =
  // CNPJ
  | 'emptyDescricao'
  | 'equalDescricao'
  | 'equalListDescricao'
  | 'invalidCharDescricao'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorPerfilMessage(error: ErrorPerfilType): string {
  switch (error) {
    // ─── CNPJ ───
    case 'emptyDescricao':
      return 'O descrição é obrigatório.';
    case 'equalDescricao':
      return 'O descrição informado é igual ao anterior!';
    case 'equalListDescricao':
      return 'O descrição informado já possui registro!';
    case 'invalidCharDescricao':
      return 'O descrição não aceita letras.';

    default:
      return '';
  }
}
