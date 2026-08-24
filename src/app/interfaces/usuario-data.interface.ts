export interface UsuarioData {
  id?: string;
  cracha?: number;
  nome: string;
  dataNascimento: Date;
  dataAdmissao?: Date;
  dataDesligamento?: Date | null;
  perfilId?: string;
  turno: string;
  escala: string;
  empresaId: string;
  status?: boolean;
}
