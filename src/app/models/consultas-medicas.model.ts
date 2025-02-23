export interface Consulta {
  consulta_id?: number;
  fecha: string;
  hora: string;
  motivo: string;
  sintomas: string;
  tipoConsulta: string;
  diagnostico: string;
  paciente_fk: number;
}
