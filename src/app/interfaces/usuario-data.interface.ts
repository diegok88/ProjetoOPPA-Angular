export interface UsuarioData {
  id?: string;
  cracha?: number;
  nome: string;
  dataNascimento: Date;
  dataAdmissao?: Date;
  dataDesligamento?: Date | null;
  perfilId?: string;
  desPerfil?: string | null;
  turno: string;
  escala: string;
  empresaId?: string;
  desEmpresa?: string | null;
  status?: boolean;
}
