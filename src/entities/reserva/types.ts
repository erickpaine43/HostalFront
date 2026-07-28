export interface ReservaDto {
  id: number;
  fechaReservacion: string;
  fechaEntrada: string;
  fechaSalida: string;
  importe: number;
  clienteId: number;
  clienteNombre: string;
  habitacionId: number;
  habitacionNumero: string;
  estaElClienteEnHostal: boolean;
  estaCancelada: boolean;
  fechaCancelacion?: string;
  motivoCancelacion?: string;
}

export interface ReservaCrearDto {
  fechaEntrada: string;
  fechaSalida: string;
  clienteId: number;
  habitacionNumero: number;
}

export interface CancelarReservaDto {
  Motivo: string;
}

export interface CambiarHabitacionDto {
  NuevaHabitacionId: number;
}