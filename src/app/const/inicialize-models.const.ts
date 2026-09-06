import { EmpresaData } from '../interfaces/empresa-data.interface';

/* CONSTANTES DE INICIALIZAÇÃO DE MODELOS DE FORMULARIOS */

export const INICIALIZAR_EMPRESA_FORMS: EmpresaData = {
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
