export interface Documento {
  fecha_creacion: string;
  folio: string;
  codigo_validacion: string;
  consulta: {
    diagnostico: string;
  };
}
