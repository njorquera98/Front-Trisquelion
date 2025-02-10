export interface Horario {
  horario_id?: number;
  dia_semana: string;
  hora: string | null;
  paciente_fk: number
}
