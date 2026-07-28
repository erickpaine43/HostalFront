export interface AmaDeLlavesDto {
  id: number;
  nombreApellidos: string;
  ci: string;
  numeroTelefono: string;
  habitacionesAsignadas?: HabitacionAsignadaDto[];
}

export interface AmaDeLlavesCrearDto {
  nombreApellidos: string;
  ci: string;
  numeroTelefono: string;
}
export interface HabitacionAsignadaDto {
  numero: number;
}