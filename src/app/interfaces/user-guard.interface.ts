export interface UserGuard {
  id: string;
  cracha: number;
  nome: string;
  dataNascimento: Date;
  dataAdmissao: Date;
  perfilId: string;
  desPerfil: string;
  turno: string;
  escala: string;
  empresaId: string;
  desEmpresa: string;
  status: boolean;
}
