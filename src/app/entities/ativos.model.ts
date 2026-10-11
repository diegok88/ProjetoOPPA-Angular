import { EmpresaModel } from './empresa.model';

/* MODELO DA ENTIDADE */
export interface AtivosModel {
  id?: string;
  codigo?: number;
  descricao: string;
  modelo: string;
  fabricante: string;
  ano?: number;
  setorId: string;
  setor?: { descricao: string } | null;
  empresaId?: string;
  empresa?: { razaoSocial: string } | null;
  status?: boolean;
}

/* MODELO DO FORMULARIO: codigo NÃO existe aqui (autoincrement do banco).
   ano fica string no form (input/mask) e é convertido para number
   só no payload do executar() */
export interface AtivosForm {
  descricao: string;
  modelo: string;
  fabricante: string;
  ano: string;
  setorId: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposAtivos: (keyof AtivosForm)[] = [
  'descricao',
  'modelo',
  'fabricante',
  'ano',
  'setorId', 
];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposAtivosNumeros: (keyof AtivosForm)[] = ['ano'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS
   (Ativos não tem campo somente-letra: descricao/modelo/fabricante
   aceitam letras e números, por isso a lista fica vazia) */
export const CamposAtivosLetras: (keyof AtivosForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposAtivosLivres: (keyof AtivosForm)[] = ['descricao', 'modelo', 'fabricante'];

/* MAPEAMENTO DA ENTIDADE */
export const AtivosMap = {
  CODIGO: 'codigo',
  DESCRICAO: 'descricao',
  MODELO: 'modelo',
  FABRICANTE: 'fabricante',
  ANO: 'ano',
  SETOR_ID: 'setorId',
} as const;

/* TIPOS DA ENTIDADE */
export type AtivosType = (typeof AtivosMap)[keyof typeof AtivosMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_ATIVOS_ENTITY = (): AtivosModel => ({
  id: '',
  codigo: undefined,
  descricao: '',
  modelo: '',
  fabricante: '',
  ano: undefined,
  setorId: '',
  setor: undefined,
  empresaId: '',
  empresa: undefined,
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_ATIVOS_FORMS = (): AtivosForm => ({
  descricao: '',
  modelo: '',
  fabricante: '',
  ano: '',
  setorId: '',
});

/* TIPOS DE FALHAS
   - codigo NÃO tem erros: é autoincrement, não passa pelo form
   - descricao/modelo/fabricante são livres: sem invalidChar
   - ano é numérico: com invalidChar
   - setorId é select: sem invalidChar (não há digitação) */
export type ErrorAtivosType =
  // Descrição
  | 'emptyDescricao'
  | 'equalDescricao'
  // Modelo
  | 'emptyModelo'
  | 'equalModelo'
  // Fabricante
  | 'emptyFabricante'
  | 'equalFabricante'
  // Ano
  | 'emptyAno'
  | 'equalAno'
  | 'invalidCharAno'
  // Setor
  | 'emptySetorId'
  | 'equalSetorId'
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorAtivosMessage(error: ErrorAtivosType): string {
  switch (error) {
    // ─── Descrição ───
    case 'emptyDescricao':
      return 'A Descrição é obrigatória.';
    case 'equalDescricao':
      return 'A Descrição informada é igual à anterior!';

    // ─── Modelo ───
    case 'emptyModelo':
      return 'O Modelo é obrigatório.';
    case 'equalModelo':
      return 'O Modelo informado é igual ao anterior!';

    // ─── Fabricante ───
    case 'emptyFabricante':
      return 'O Fabricante é obrigatório.';
    case 'equalFabricante':
      return 'O Fabricante informado é igual ao anterior!';

    // ─── Ano ───
    case 'emptyAno':
      return 'O Ano é obrigatório.';
    case 'equalAno':
      return 'O Ano informado é igual ao anterior!';
    case 'invalidCharAno':
      return 'O Ano não aceita letras.';

    // ─── Setor ───
    case 'emptySetorId':
      return 'O Setor é obrigatório.';
    case 'equalSetorId':
      return 'O Setor informado é igual ao anterior!';

    default:
      return '';
  }
}
