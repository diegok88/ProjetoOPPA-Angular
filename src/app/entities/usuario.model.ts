/* MODELO DA ENTIDADE */
export interface UsuarioModel {
  id?: string;
  cracha?: number;
  nome: string;
  dataNascimento: Date | null;
  dataAdmissao?: Date | null;
  dataDesligamento?: Date | null;
  perfilId?: string | null;
  desPerfil?: string | null;
  turno: string;
  escala: string;
  empresaId?: string | null;
  desEmpresa?: string | null;
  status?: boolean;
  nomeGestor?: string | null;
  crachaGestor?: number | null;
}

export interface UsuarioForm {
  nome: string;
  dataNascimento: Date | null;
  dataAdmissao?: Date | null;
  perfilId?: string;
  turno: string;
  escala: string;
  empresaId?: string;
}

/* CONSTANTES ADCIONAIS */
export const Escalas = { A: 'A', B: 'B', C: 'C', D: 'D' } as const;

export type EscalaType = (typeof Escalas)[keyof typeof Escalas];

export const Turnos = {
  MANHA: 'MANHA',
  TARDE: 'TARDE',
  NOITE: 'NOITE',
  COMERCIAL: 'COMERCIAL',
} as const;

export type TurnoType = (typeof Turnos)[keyof typeof Turnos];

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposUsuario: (keyof UsuarioForm)[] = [
  'nome',
  'dataNascimento',
  'dataAdmissao',
  'perfilId',
  'turno',
  'escala',
  'empresaId',
];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposUsuarioNumeros: (keyof UsuarioForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposUsuarioLetras: (keyof UsuarioForm)[] = ['nome', 'turno', 'escala'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS DATAS */
export const CamposUsuarioData: (keyof UsuarioForm)[] = ['dataNascimento', 'dataAdmissao'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposUsuarioLivres: (keyof UsuarioForm)[] = ['perfilId', 'empresaId'];

/* MAPEAMENTO DA ENTIDADE */
export const UsuarioMap = {
  NOME: 'nome',
  DATANASCIMENTO: 'dataNascimento',
  DATAADMISSAO: 'dataAdmissao',
  PERFILID: 'perfilId',
  TURNO: 'turno',
  ESCALA: 'escala',
  EMPRESAID: 'empresaId',
} as const;

/* TIPOS DA ENTIDADE */
export type UsuarioType = (typeof UsuarioMap)[keyof typeof UsuarioMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_USUARIO_ENTITY = (): UsuarioModel => ({
  id: '',
  cracha: undefined,
  nome: '',
  dataNascimento: null,
  dataAdmissao: null,
  dataDesligamento: null,
  perfilId: '',
  desPerfil: '',
  turno: '' as TurnoType,
  escala: '' as EscalaType,
  empresaId: '',
  desEmpresa: '',
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO - FACTORY */
export const INICIALIZAR_USUARIO_FORMS = (): UsuarioForm => ({
  nome: '',
  dataNascimento: null,
  dataAdmissao: null,
  perfilId: '',
  turno: '' as TurnoType,
  escala: '' as EscalaType,
  empresaId: '',
});

/* TIPOS DE FALHAS */
export type ErrorUsuarioType =
  // NOME
  | 'emptyNome'
  | 'equalNome'
  | 'invalidCharNome'
  // DATA DE NASCIMENTO
  | 'emptyDataNascimento'
  | 'equalDataNascimento'
  | 'invalidDateDataNascimento'
  // DATA DE ADMISSÃO
  | 'emptyDataAdmissao'
  | 'equalDataAdmissao'
  | 'invalidDateDataAdmissao'
  // PERFIL ID
  | 'emptyPerfilId'
  | 'equalPerfilId'
  // TURNO
  | 'emptyTurno'
  | 'equalTurno'
  | 'invalidCharTurno'
  // TURNO
  | 'emptyEscala'
  | 'equalEscala'
  | 'invalidCharEscala'
  // EMPRESA ID
  | 'emptyEmpresaId'
  | 'equalEmpresaId'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorUsuarioMessage(error: ErrorUsuarioType): string {
  switch (error) {
    // ─── NOME ───
    case 'emptyNome':
      return 'O nome é obrigatório.';
    case 'equalNome':
      return 'O nome informado é igual ao anterior!';
    case 'invalidCharNome':
      return 'O nome não aceita números.';

    // ─── DATA DE NASCIMENTO ───
    case 'emptyDataNascimento':
      return 'A data de nascimento é obrigatória.';
    case 'equalDataNascimento':
      return 'A data de nascimento informada é igual à anterior!';
    case 'invalidDateDataNascimento':
      return 'A data de nascimento é inválida — verifique dia, mês e ano.';

    // ─── DATA DE ADMISSÃO ───
    case 'emptyDataAdmissao':
      return 'A data de admissão é obrigatória.';
    case 'equalDataAdmissao':
      return 'A data de admissão informada é igual à anterior!';
    case 'invalidDateDataAdmissao':
      return 'A data de admissão é inválida — verifique dia, mês e ano.';

    // ─── PERFIL ID ───
    case 'emptyPerfilId':
      return 'O perfil é obrigatório.';
    case 'equalPerfilId':
      return 'O perfil informado é igual ao anterior!';

    // ─── TURNO ───
    case 'emptyTurno':
      return 'O turno é obrigatório.';
    case 'equalTurno':
      return 'O turno informado é igual ao anterior!';
    case 'invalidCharTurno':
      return 'O turno não aceita números.';

    // ─── ESCALA ───
    case 'emptyEscala':
      return 'A escala é obrigatória.';
    case 'equalEscala':
      return 'A escala informada é igual à anterior!';
    case 'invalidCharEscala':
      return 'A escala não aceita números.';

    // ─── EMPRESA ID ───
    case 'emptyEmpresaId':
      return 'A empresa é obrigatória.';
    case 'equalEmpresaId':
      return 'A empresa informada é igual à anterior!';

    default:
      return '';
  }
}
