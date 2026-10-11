import { TurnoType } from './usuario.model';

export interface GestorModel {
  id: string;
  colaboradorId: string;
  gestorId: string;
  status: boolean;
  colaborador: { id: string; cracha: number; nome: string; turno?: TurnoType };
  gestor: { id: string; cracha: number; nome: string; turno?: TurnoType };
}
