import { TurnoType } from './usuario.model';

/* MODELO DA ENTIDADE */
export interface CompetenciaSetorialModel {
  id?: string;
  colaboradorId: string;
  gestorId?: string;
  setorId: string;
  turno?: TurnoType;
  status?: boolean;
  setor?: { descricao: string };
}

export interface CompetenciaSetorialForm {
  colaboradorId: string;
  setorId: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposCompetenciaSetorial: (keyof CompetenciaSetorialForm)[] = ['setorId'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposCompetenciaSetorialNumeros: (keyof CompetenciaSetorialForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposCompetenciaSetorialLetras: (keyof CompetenciaSetorialForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposCompetenciaSetorialLivres: (keyof CompetenciaSetorialForm)[] = ['setorId'];

/* MAPEAMENTO DA ENTIDADE */
export const CompetenciaSetorialMap = {
  SETOR_ID: 'setorId',
} as const;

/* TIPOS DA ENTIDADE */
export type CompetenciaSetorialType =
  (typeof CompetenciaSetorialMap)[keyof typeof CompetenciaSetorialMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_COMPETENCIA_SETORIAL_ENTITY = (): CompetenciaSetorialModel => ({
  id: '',
  colaboradorId: '',
  gestorId: '',
  setorId: '',
  turno: '' as TurnoType,
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_COMPETENCIA_SETORIAL_FORMS = (): CompetenciaSetorialForm => ({
  colaboradorId: '',
  setorId: '',
});

export type ErrorCompetenciaSetorialType = 'emptySetorId' | null;

export function getErrorCompetenciaSetorialMessage(error: ErrorCompetenciaSetorialType): string {
  switch (error) {
    case 'emptySetorId':
      return 'O setor é obrigatório.';

    default:
      return '';
  }
}
