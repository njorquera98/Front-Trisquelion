export interface Evaluacion {
  evaluacion_id?: number;
  objetivo: string;
  diagnostico: string;
  anamnesis: string;
  fechaIngreso: string;
  paciente_fk: number;
  bono_fk: number;
}

