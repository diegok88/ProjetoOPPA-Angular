/* MODELO DA ENTIDADE */
export interface PerfilModel {
  id?: string;
  codigo?: number;
  descricao: string;
  nivel: string;
  status?: boolean;
}

export interface PerfilForm {
  descricao: string;
  nivel: string;
}

/* CONSTANTE DO CAMPOS SELECT */
export const Niveis = {
  NIVEL1: 'NIVEL 1',
  NIVEL2: 'NIVEL 2',
  NIVEL3: 'NIVEL 3',
  NIVEL4: 'NIVEL 4',
} as const;

export type NivelType = (typeof Niveis)[keyof typeof Niveis];

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposPerfil: (keyof PerfilForm)[] = ['descricao', 'nivel'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposPerfilNumeros: (keyof PerfilForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposPerfilLetras: (keyof PerfilForm)[] = ['descricao'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposPerfilLivres: (keyof PerfilForm)[] = ['nivel'];

/* MAPEAMENTO DA ENTIDADE */
export const PerfilMap = {
  DESCRICAO: 'descricao',
  NIVEL: 'nivel',
} as const;

/* TIPOS DA ENTIDADE */
export type PerfilType = (typeof PerfilMap)[keyof typeof PerfilMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_PERFIL_ENTITY = (): PerfilModel => ({
  id: '',
  codigo: undefined,
  descricao: '',
  nivel: '',
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_PERFIL_FORMS = (): PerfilForm => ({
  descricao: '',
  nivel: '',
});

/* TIPOS DE FALHAS */
export type ErrorPerfilType =
  // DESCRIÇÃO
  | 'emptyDescricao'
  | 'equalDescricao'
  | 'equalListDescricao'
  | 'invalidCharDescricao'
  // NIVEL
  | 'emptyNivel'
  | 'equalNivel'
  | 'equalListNivel'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorPerfilMessage(error: ErrorPerfilType): string {
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
    // ─── NIVEL ───
    case 'emptyNivel':
      return 'O nivel é obrigatório.';
    case 'equalNivel':
      return 'O nivel informado é igual ao anterior!';
    case 'equalListNivel':
      return 'O nivel informado já possui registro!';

    default:
      return '';
  }
}
