export interface DialogoConfirmarData<T = any> {
  icone: string;
  titulo: string;
  entidade?: string;
  mensagem: string;
  dados?: string;
  acao: () => Promise<T> | import('rxjs').Observable<T>;
}

export const CONFIRMAR_CADASTRAR = {
  icone: '/icons/add_circle_84.png',
  titulo: 'Novo',
  mensagem: 'Deseja confirmar o cadastro do',
};

export const CONFIRMAR_ATUALIZAR = {
  icone: '/icons/add_circle_84.png',
  titulo: 'Atualizar',
  mensagem: 'Deseja confirmar a atualização do',
};

export const CONFIRMAR_ATIVAR = {
  icone: '/icons/add_circle_84.png',
  titulo: 'Ativar',
  mensagem: 'Deseja confirmar a ativação do',
};

export const CONFIRMAR_INATIVAR = {
  icone: '/icons/add_circle_84.png',
  titulo: 'Inativar',
  mensagem: 'Deseja confirmar o inativação do',
};

export const CONFIRMAR_ELIMINAR = {
  icone: '/icons/add_circle_84.png',
  titulo: 'Eliminar',
  mensagem: 'Deseja confirmar o eliminação do',
};
