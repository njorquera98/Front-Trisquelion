import { Paciente } from "./paciente.model";

export interface Bono {
  bono_id?: number;
  folio: string;
  cantidad: number;
  fecha: string;
  valor: number;
  paciente_fk: number;
  sesionesDisponibles: number;
  paciente?: Paciente;
}

