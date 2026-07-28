export interface TrazaDto {
  id: number;
  fechaHora: string;
  operacion: string;
  tablaAfectada: string;
  registroId: number;
  detalles: string;
}

export interface ClienteActivoReporteDto {
  nombreApellidos: string;
  numeroHabitacion: string;
}

export interface HabitacionesDisponiblesQuery {
  fechaInicio: string;
  fechaFin: string;
}