export interface Sesion {
  sesion_id?: number;
  n_de_sesion: number;
  fecha: Date;
  hora: string;
  descripcion: string;
  tipo_sesion: string;
  paciente_fk: number;
  folio?: string;
  bono_fk: number;
  evaluacion_fk: number;
}

