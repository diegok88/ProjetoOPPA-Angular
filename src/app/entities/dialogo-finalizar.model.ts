export interface DialogoFinalizarData {
  icone: string;
  titulo: string;
  operacao?: string;
  dados?: string;
  mensagem: string;
  erros?: string[];
}

export const FINALIZAR_SUCESSO: DialogoFinalizarData = {
  icone: '/icons/check_circle_84.png',
  titulo: 'Sucesso!',
  mensagem: 'Realizado com exíto a operação.',
};

export const FINALIZAR_ERRO: DialogoFinalizarData = {
  icone: '/icons/error_84.png',
  titulo: 'Erro!',
  mensagem: 'Falha na realização da operação.',
};

export const FINALIZAR_CANCELAR: DialogoFinalizarData = {
  icone: '/icons/cancel_84.png',
  titulo: 'Cancelado!',
  mensagem: 'Cancelada com exíto a operação.',
};
