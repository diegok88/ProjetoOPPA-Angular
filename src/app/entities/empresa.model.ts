/* MODELO DA ENTIDADE */
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
  qtdCracha?: number;
}

export interface EmpresaForm {
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
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposEmpresa: (keyof EmpresaForm)[] = [
  'cnpj',
  'razaoSocial',
  'nomeFantasia',
  'contato',
  'email',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'cep',
] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposEmpresaNumeros: (keyof EmpresaForm)[] = [
  'cnpj',
  'contato',
  'numero',
  'cep',
] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS */
export const CamposEmpresaLetras: (keyof EmpresaForm)[] = [
  'rua',
  'bairro',
  'cidade',
  'estado',
] as const;

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposEmpresaLivres: (keyof EmpresaForm)[] = [
  'razaoSocial',
  'nomeFantasia',
  'email',
] as const;

/* MAPEAMENTO DA ENTIDADE */
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

/* TIPOS DA ENTIDADE */
export type EmpresaType = (typeof EmpresaMap)[keyof typeof EmpresaMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
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

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_EMPRESA_FORMS: EmpresaForm = {
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

/* TIPOS DE FALHAS */
export type ErrorEmpresaType =
  // CNPJ
  | 'emptyCnpj'
  | 'equalCnpj'
  | 'invalidCharCnpj'
  // Razão Social
  | 'emptyRazaoSocial'
  | 'equalRazaoSocial'
  | 'invalidCharRazaoSocial'
  // Nome Fantasia
  | 'emptyNomeFantasia'
  | 'equalNomeFantasia'
  | 'invalidCharNomeFantasia'
  // Contato
  | 'emptyContato'
  | 'equalContato'
  | 'invalidCharContato'
  // Email
  | 'emptyEmail'
  | 'equalEmail'
  | 'invalidEmail'
  // Rua
  | 'emptyRua'
  | 'equalRua'
  | 'invalidCharRua'
  // Número
  | 'emptyNumero'
  | 'equalNumero'
  | 'invalidCharNumero'
  // Bairro
  | 'emptyBairro'
  | 'equalBairro'
  | 'invalidCharBairro'
  // Cidade
  | 'emptyCidade'
  | 'equalCidade'
  | 'invalidCharCidade'
  // Estado
  | 'emptyEstado'
  | 'equalEstado'
  | 'invalidCharEstado'
  // CEP
  | 'emptyCep'
  | 'equalCep'
  | 'invalidCharCep'
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorMessage(error: ErrorEmpresaType): string {
  switch (error) {
    // ─── CNPJ ───
    case 'emptyCnpj':
      return 'O CNPJ é obrigatório.';
    case 'equalCnpj':
      return 'O CNPJ informado é igual ao anterior!';
    case 'invalidCharCnpj':
      return 'O CNPJ não aceita letras.';

    // ─── Razão Social ───
    case 'emptyRazaoSocial':
      return 'A Razão Social é obrigatória.';
    case 'equalRazaoSocial':
      return 'A Razão Social informada é igual à anterior!';
    case 'invalidCharRazaoSocial':
      return 'A Razão Social não aceita números.';

    // ─── Nome Fantasia ───
    case 'emptyNomeFantasia':
      return 'O Nome Fantasia é obrigatório.';
    case 'equalNomeFantasia':
      return 'O Nome Fantasia informado é igual ao anterior!';
    case 'invalidCharNomeFantasia':
      return 'O Nome Fantasia não aceita números.';

    // ─── Contato ───
    case 'emptyContato':
      return 'O Contato é obrigatório.';
    case 'equalContato':
      return 'O Contato informado é igual ao anterior!';
    case 'invalidCharContato':
      return 'O Contato não aceita números.';

    // ─── Email ───
    case 'emptyEmail':
      return 'O E-mail é obrigatório.';
    case 'equalEmail':
      return 'O E-mail informado é igual ao anterior!';

    // ─── Rua ───
    case 'emptyRua':
      return 'A Rua é obrigatória.';
    case 'equalRua':
      return 'A Rua informada é igual à anterior!';
    case 'invalidCharRua':
      return 'A Rua não aceita números.';

    // ─── Número ───
    case 'emptyNumero':
      return 'O Número é obrigatório.';
    case 'equalNumero':
      return 'O Número informado é igual ao anterior!';
    case 'invalidCharNumero':
      return 'O Número não aceita letras.';

    // ─── Bairro ───
    case 'emptyBairro':
      return 'O Bairro é obrigatório.';
    case 'equalBairro':
      return 'O Bairro informado é igual ao anterior!';
    case 'invalidCharBairro':
      return 'O Bairro não aceita números.';

    // ─── Cidade ───
    case 'emptyCidade':
      return 'A Cidade é obrigatória.';
    case 'equalCidade':
      return 'A Cidade informada é igual à anterior!';
    case 'invalidCharCidade':
      return 'A Cidade não aceita números.';

    // ─── Estado ───
    case 'emptyEstado':
      return 'O Estado é obrigatório.';
    case 'equalEstado':
      return 'O Estado informado é igual ao anterior!';
    case 'invalidCharEstado':
      return 'O Estado não aceita números.';

    // ─── CEP ───
    case 'emptyCep':
      return 'O CEP é obrigatório.';
    case 'equalCep':
      return 'O CEP informado é igual ao anterior!';
    case 'invalidCharCep':
      return 'O CEP não aceita letras.';

    default:
      return '';
  }
}
