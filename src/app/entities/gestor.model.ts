export interface GestorModel {
  id: string;
  colaboradorId: string;
  gestorId: string;
  status: boolean;
  colaborador: { id: string; cracha: number; nome: string };
  gestor: { id: string; cracha: number; nome: string };
}
