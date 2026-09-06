export interface PerfilModel {
  id?: string;
  codigo?: number;
  descricao: string;
  status?: boolean;
}

export const PerfilMap = {
  DESCRICAO: 'descricao',
} as const;

export type PerfilType = (typeof PerfilMap)[keyof typeof PerfilMap];

export const INICIALIZAR_PERFIL_ENTITY: PerfilModel = {
  id: '',
  codigo: undefined,
  descricao: '',
  status: undefined,
} as const;

export const INICIALIZAR_PERFIL_FORMS: PerfilModel = {
  descricao: '',
} as const;
