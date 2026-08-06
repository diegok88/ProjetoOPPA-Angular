export interface UserGuard {
  id: string;
  cracha: number;
  nome: string;
  dataNascimento: Date;
  dataAdmissao: Date;
  perfilId: string;
  turno: string;
  escala: string;
  empresaId: string;
  status: boolean;
}
