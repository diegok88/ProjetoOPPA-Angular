export interface DialogoConfirmarData<T = any> {
  titulo: string;
  mensagem: string;
  acao: () => Promise<T> | import('rxjs').Observable<T>;
}
