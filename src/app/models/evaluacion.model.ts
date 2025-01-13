import { Bono } from "./bono.model";

export interface Evaluacion {
  evaluacion_id?: number;
  objetivo: string;
  diagnostico: string;
  anamnesis: string;
  fechaIngreso: Date;
  paciente_fk: number;
  bono_fk: number;
  bono?: Bono;
}

