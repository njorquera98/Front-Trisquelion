export interface Paciente {
  paciente_id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: Date;
  prevision: string;
  activo: boolean;
}
