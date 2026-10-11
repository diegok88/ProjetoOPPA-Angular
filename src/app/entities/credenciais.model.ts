/* MODELO DA ENTIDADE */
export interface SenhaModel {
  atual: string;
  novo: string;
}

export interface SenhaForm {
  senhaAtual: string;
  novaSenha: string;
  repitaSenha: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposSenhas: (keyof SenhaForm)[] = ['senhaAtual', 'novaSenha', 'repitaSenha'];

/* MAPEAMENTO DA ENTIDADE */
export const SenhaMap = {
  SENHA_ATUAL: 'senhaAtual',
  NOVA_SENHA: 'novaSenha',
  REPITA_SENHA: 'repitaSenha',
} as const;

/* TIPOS DA ENTIDADE */
export type SenhaType = (typeof SenhaMap)[keyof typeof SenhaMap];

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_SENHA_FORMS = (): SenhaForm => ({
  senhaAtual: '',
  novaSenha: '',
  repitaSenha: '',
});

/* TIPOS DE FALHAS */
export type ErrorSenhaType =
  // SENHA ATUAL
  | 'emptySenhaAtual'
  | 'invalidCharSenhaAtual'
  // NOVA SENHA
  | 'emptyNovaSenha'
  | 'equalNovaSenha'
  | 'invalidCharNovaSenha'
  // REPITA SENHA
  | 'emptyRepitaSenha'
  | 'differentRepitaSenha'
  | 'invalidCharRepitaSenha'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorSenhaMessage(error: ErrorSenhaType): string {
  switch (error) {
    // SENHA ATUAL
    case 'emptySenhaAtual':
      return 'A senha atual é obrigatório.';
    case 'invalidCharSenhaAtual':
      return 'A senha atual informado não deve conter caracteres especiais!';
    // NOVA SENHA
    case 'emptyNovaSenha':
      return 'A nova senha é obrigatório.';
    case 'equalNovaSenha':
      return 'A nova senha é igual ao anterior!';
    case 'invalidCharNovaSenha':
      return 'A nova senha informada não deve conter caracteres especiais!';

    // REPITA SENHA
    case 'emptyRepitaSenha':
      return 'A senha nova repetida é obrigatório.';
    case 'differentRepitaSenha':
      return 'A senha nova repetida informado é diferente da nova senha!';
    case 'invalidCharRepitaSenha':
      return 'A senha nova repetida informada não deve conter caracteres especiais!';

    default:
      return '';
  }
}

/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* MODELO DA ENTIDADE */
export interface PinModel { 
  atual: string;
  novo: string;
}

export interface PinForm {
  pinAtual: string;
  novaPin: string;
  repitaPin: string;
}

/* CONSTANTE DOS CAMPOS DA ENTIDADE */
export const CamposPin: (keyof PinForm)[] = ['pinAtual', 'novaPin', 'repitaPin'];

/* CONSTANTE DOS CAMPOS DA ENTIDADE ACEITA APENAS NUMEROS */
export const CamposPinNumeros: (keyof PinForm)[] = ['pinAtual', 'novaPin', 'repitaPin'];

/* MAPEAMENTO DA ENTIDADE */
export const PinMap = {
  PIN_ATUAL: 'pinAtual',
  NOVA_PIN: 'novaPin',
  REPITA_PIN: 'repitaPin',
} as const;

/* TIPOS DA ENTIDADE */
export type PinType = (typeof PinMap)[keyof typeof PinMap];

/* INICIALIZADOR DO OBJETO SIGNALS DO FORMULARIO */
export const INICIALIZAR_PIN_FORMS = (): PinForm => ({
  pinAtual: '',
  novaPin: '',
  repitaPin: '',
});

/* TIPOS DE FALHAS */
export type ErrorPinType =
  // PIN ATUAL
  | 'emptyPinAtual'
  | 'invalidCharPinAtual'
  // NOVA PIN
  | 'emptyNovaPin'
  | 'equalNovaPin'
  | 'invalidCharNovaPin'
  // REPITA PIN
  | 'emptyRepitaPin'
  | 'differentRepitaPin'
  | 'invalidCharRepitaPin'
  // NULL
  | null;

/* RETORNO DESCRITIVOS DAS FALHAS */
export function getErrorPinMessage(error: ErrorPinType): string {
  switch (error) {
    // PIN ATUAL
    case 'emptyPinAtual':
      return 'O pin atual é obrigatório.';
    case 'invalidCharPinAtual':
      return 'O pin atual informado não deve conter caracteres especiais!';

    // NOVA PIN
    case 'emptyNovaPin':
      return 'O novo pin é obrigatório.';
    case 'equalNovaPin':
      return 'O novo pin é igual ao anterior!';
    case 'invalidCharNovaPin':
      return 'O novo pin informado não deve conter caracteres especiais!';

    // REPITA PIN
    case 'emptyRepitaPin':
      return 'A repetição do pin é obrigatória.';
    case 'differentRepitaPin':
      return 'A repetição do pin informada é diferente do novo pin!';
    case 'invalidCharRepitaPin':
      return 'A repetição do pin informada não deve conter caracteres especiais!';

    default:
      return '';
  }
}
