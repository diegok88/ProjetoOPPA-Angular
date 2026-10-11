/* MODELO DA ENTIDADE */
export interface FalhasModel { 
  id?: string;
  codigo?: string;
  descricao: string;
  ativoId: string;
  ativo?: { descricao: string; modelo: string } | null;
  direcionamentoId: string;
  perfil?: { descricao: string; nivel: string } | null;
  status?: boolean;
}

/* MODELO DO FORMULARIO: id NÃO existe aqui (auto-gerado pelo banco).
   status NÃO existe aqui (default(true) no banco).
   codigo, descricao, ativoId e direcionamentoId são preenchidos pelo usuário. */
export interface FalhasForm {
  codigo: string;
  descricao: string;
  ativoId: string;
  direcionamentoId: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposFalhas: (keyof FalhasForm)[] = [
  'codigo',
  'descricao',
  'ativoId',
  'direcionamentoId',
];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS
   (codigo é o único campo numérico preenchido pelo usuário) */
export const CamposFalhasNumeros: (keyof FalhasForm)[] = [];
/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS
   (Falha não tem campo somente-letra, por isso a lista fica vazia) */
export const CamposFalhasLetras: (keyof FalhasForm)[] = [];
/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposFalhasLivres: (keyof FalhasForm)[] = ['descricao', 'codigo'];

/* MAPEAMENTO DA ENTIDADE */
export const FalhasMap = {
  ID: 'id',
  CODIGO: 'codigo',
  DESCRICAO: 'descricao',
  ATIVO_ID: 'ativoId',
  DIRECIONAMENTO_ID: 'direcionamentoId',
  STATUS: 'status',
} as const;

/* TIPOS DA ENTIDADE */
export type FalhasType = (typeof FalhasMap)[keyof typeof FalhasMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_FALHAS_ENTITY = (): FalhasModel => ({
  id: '',
  codigo: '',
  descricao: '',
  ativoId: '',
  ativo: undefined,
  direcionamentoId: '',
  perfil: undefined,
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_FALHAS_FORMS = (): FalhasForm => ({
  codigo: '',
  descricao: '',
  ativoId: '',
  direcionamentoId: '',
});

/* TIPOS DE FALHAS
   - id NÃO tem erros: é gerado pelo banco, não passa pelo form.
   - status NÃO tem erros: é default(true), não passa pelo form.
   - codigo, descricao, ativoId e direcionamentoId são preenchidos pelo usuário.
   - ativoId e direcionamentoId são selects: sem invalidChar (não há digitação).
   - codigo é numérico: sem invalidChar (a validação é de dígitos no keypress). */
export type ErrorFalhasType =
  // Código
  | 'emptyCodigo'
  | 'equalCodigo'
  | 'invalidCharCodigo'
  // Descrição
  | 'emptyDescricao'
  | 'equalDescricao'
  | 'invalidCharDescricao'
  // Ativo
  | 'emptyAtivoId'
  | 'equalAtivoId'
  // Direcionamento
  | 'emptyDirecionamentoId'
  | 'equalDirecionamentoId'
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorFalhasMessage(error: ErrorFalhasType): string {
  switch (error) {
    // ─── Código ───
    case 'emptyCodigo':
      return 'O Código é obrigatório.';
    case 'equalCodigo':
      return 'O Código informado é igual ao anterior!';
    case 'invalidCharCodigo':
      return 'A Codigo não aceita caracteres especiais.';
    // ─── Descrição ───
    case 'emptyDescricao':
      return 'A Descrição é obrigatória.';
    case 'equalDescricao':
      return 'A Descrição informada é igual à anterior!';
    case 'invalidCharDescricao':
      return 'A Descrição não aceita caracteres especiais.';
    // ─── Ativo ───
    case 'emptyAtivoId':
      return 'O Ativo é obrigatório.';
    case 'equalAtivoId':
      return 'O Ativo informado é igual ao anterior!';
    // ─── Direcionamento ───
    case 'emptyDirecionamentoId':
      return 'O Direcionamento é obrigatório.';
    case 'equalDirecionamentoId':
      return 'O Direcionamento informado é igual ao anterior!';
    default:
      return '';
  }
}
