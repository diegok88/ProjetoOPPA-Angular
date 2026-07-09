export const SUBMENU_OPTIONS = {
  Principal: 'principal',
  Operacional: 'operacional',
  Solicitacoes: 'solicitacao',
  Eficiencia: 'eficiencia',
  Tipos: 'tipos',
  Usuario: 'usuario',
} as const;

export type SubmenuOptionAdmin = (typeof SUBMENU_OPTIONS)[keyof typeof SUBMENU_OPTIONS];
