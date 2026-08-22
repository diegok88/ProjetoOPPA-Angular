export interface DialogoConfirmarData<T = any> {
  icone: string;
  titulo: string;
  mensagem: string;
  acao: () => Promise<T> | import('rxjs').Observable<T>;
}
