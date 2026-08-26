export interface UsuarioData {
  id?: string;
  cracha?: number;
  nome: string;
  dataNascimento: Date | null;
  dataAdmissao?: Date | null;
  dataDesligamento?: Date | null;
  perfilId?: string | null;
  desPerfil?: string | null;
  turno: string;
  escala: string;
  empresaId?: string | null;
  desEmpresa?: string | null;
  status?: boolean;
}
