import { Paciente } from "./paciente.model";

export interface Asistencia {
  asistencia_id: number;
  fecha: string;
  hora_programada: string;
  estado: string | null;
  paciente: Paciente;
}
