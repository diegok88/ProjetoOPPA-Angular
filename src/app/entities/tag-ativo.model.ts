/* MODELO DA ENTIDADE */
export interface TagAtivosModel {
  id?: string;
  codigo?: number;
  descricao: string;
  ativoId: string;
  ativo?: { descricao: string; modelo: string } | null;
  senha: string;
  status?: boolean;
}

/* MODELO DO FORMULARIO: id NÃO existe aqui (auto-gerado pelo banco).
   codigo NÃO existe aqui (autoincrement do banco).
   status NÃO existe aqui (default(true) no banco).
   ativoId e senha são preenchidos pelo usuário. */
export interface TagAtivosForm {
  ativoId: string;
  senha: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposTagAtivos: (keyof TagAtivosForm)[] = ['ativoId', 'senha'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS
   (TagAtivo não tem campo numérico no form, por isso a lista fica vazia) */
export const CamposTagAtivosNumeros: (keyof TagAtivosForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS LETRAS
   (TagAtivo não tem campo somente-letra: descricao/senha
   aceitam letras e números, por isso a lista fica vazia) */
export const CamposTagAtivosLetras: (keyof TagAtivosForm)[] = [];

/* CONSTANTE DOS CAMPOS DA ENTIDADE LIVRES */
export const CamposTagAtivosLivres: (keyof TagAtivosForm)[] = ['senha'];

/* MAPEAMENTO DA ENTIDADE */
export const TagAtivosMap = {
  ID: 'id',
  CODIGO: 'codigo',
  DESCRICAO: 'descricao',
  ATIVO_ID: 'ativoId',
  SENHA: 'senha',
  STATUS: 'status',
} as const;

/* TIPOS DA ENTIDADE */
export type TagAtivosType = (typeof TagAtivosMap)[keyof typeof TagAtivosMap];

/* INICIALIZADOR DO OBJETO SIGNALS DE BUSCA */
export const INICIALIZAR_TAGATIVOS_ENTITY = (): TagAtivosModel => ({
  id: '',
  codigo: undefined,
  descricao: '',
  ativoId: '',
  ativo: undefined,
  senha: '',
  status: undefined,
});

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_TAGATIVOS_FORMS = (): TagAtivosForm => ({
  ativoId: '',
  senha: '',
});

/* TIPOS DE FALHAS
   - id NÃO tem erros: é gerado pelo banco, não passa pelo form.
   - codigo NÃO tem erros: é autoincrement, não passa pelo form.
   - status NÃO tem erros: é default(true), não passa pelo form.
   - descricao/será criada de forma automatizada.
   - ativoId é select: sem invalidChar (não há digitação) 
*/
export type ErrorTagAtivosType =
  // Ativo
  | 'emptyAtivoId'
  | 'equalAtivoId'
  // Senha
  | 'emptySenha'
  | 'equalSenha'
  | 'invalidCharSenha'
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorTagAtivosMessage(error: ErrorTagAtivosType): string {
  switch (error) {
    // ─── Ativo ───
    case 'emptyAtivoId':
      return 'O Ativo é obrigatório.';
    case 'equalAtivoId':
      return 'O Ativo informado é igual ao anterior!';

    // ─── Senha ───
    case 'emptySenha':
      return 'A Senha é obrigatória.';
    case 'equalSenha':
      return 'A Senha informada é igual à anterior!';
    case 'invalidCharSenha':
      return 'A Senha não aceita caracteres especiais.';

    default:
      return '';
  }
}
