export const OperationMap = {
  INICIAL: 'inicial',
  CADASTRAR: 'cadastrar',
  REGISTRO: 'registro',
} as const;

export type OperationType = (typeof OperationMap)[keyof typeof OperationMap];

export const RecordMap = {
  INFORMACAO: 'informacao',
  ATUALIZAR: 'atualizar',
  ATIVAR: 'ativar',
  INATIVAR: 'inativar',
  ELIMINAR: 'eliminar',
  AUDITORIA: 'auditoria',
} as const;

export type RecordType = (typeof RecordMap)[keyof typeof RecordMap];
